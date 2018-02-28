var {widgets} = require('../widgets/'),
    editField = require('./edit-field'),
    {updateWidget} = require('./data-workers')

var Editor = class Editor {

    constructor() {

        this.wrapper = DOM.create(`
            <div class="editor-container">
                <div class="form" id="editor-form">
                </div>
            </div>
        `)
        this.form = DOM.get(this.wrapper, '#editor-form')[0]

        this.defaults = {}
        for (var k in widgets) {
            this.defaults[k] = widgets[k].defaults()
        }

        this.selection = DOM.create('<div id="editor-selection"></div>')
        document.body.appendChild(this.selection)

        this.selectedWidgets = []

        this.enabledOnce = false
        window.onbeforeunload = ()=>{
            if (this.enabledOnce) return true
        }

    }

    enable() {

        EDITING = true

        this.enabledOnce = true

        DOM.get('.editor-root')[0].setAttribute('data-widget', DOM.get('.root-container')[0].getAttribute('data-widget'))
        DOM.get('.editor-root')[0].classList.remove('disabled')
        DOM.get('.disable-editor')[0].classList.remove('on')
        DOM.get('.enable-editor')[0].classList.add('on')
        document.body.classList.add('editor-enabled')
        document.body.classList.toggle('no-grid', GRIDWIDTH == 1)


        GRIDWIDTH = getComputedStyle(document.documentElement).getPropertyValue("--grid-width")

        var gridForm = DOM.create(`
            <div class="form" id="grid-width-form">
                <div class="separator"><span>Grid</span></div>
                <div class="input-wrapper">
                    <label>Width</label>
                    <input class="input" type="number" id="grid-width-input" step="1" min="1" max="100" value="${GRIDWIDTH}"/>
                </div>
            </div>
        `)

        DOM.each(gridForm, '#grid-width-input', (input)=>{
            DOM.addEventListener(input, 'keyup mouseup change mousewheel', (e)=>{
                setTimeout(()=>{
                    var v = Math.max(Math.min(parseInt(input.value), 100), 1)
                    if (isNaN(v)) return
                    input.value = v
                    GRIDWIDTH = v
                    document.body.classList.toggle('no-grid', GRIDWIDTH == 1)
                    document.documentElement.style.setProperty("--grid-width", GRIDWIDTH)
                })
            })
        })

        DOM.get(document, '.editor-menu')[0].appendChild(gridForm)

    }

    disable() {

        EDITING = false

        if (READ_ONLY) {
            this.enable = ()=>{}
            $('.editor-menu .btn').remove()
            $('.editor-menu .title').html($('.editor-menu .title').html() + ' (disabled)').addClass('disabled')
            return
        }

        this.unselect()
        this.selectedWidgets = []
        DOM.get('.editor-root')[0].classList.add('disabled')
        DOM.get('.disable-editor')[0].classList.add('on')
        DOM.get('.enable-editor')[0].classList.remove('on')
        document.body.classList.remove('editor-enabled')

        var gridForm = DOM.get('#grid-width-form')[0]
        if (gridForm) gridForm.parentNode.removeChild(gridForm)

    }

    unselect() {

        DOM.get('#editor')[0].innerHTML = ''

        this.form.innerHTML = ''

        DOM.each(document, '.editing', (element)=>{
            element.classList.remove('editing')
        })

        $('.widget.ui-resizable').resizable('destroy')
        $('.widget.ui-draggable').draggable('destroy').find('.ui-draggable-handle').remove()

        this.selection.style.display = 'none'

    }

    select(widget, options={}){

        if (options.multi) {

            if (!this.selectedWidgets.includes(widget)) {

                var sameLevel = true
                for (var w of this.selectedWidgets) {
                    if (w.parent !== widget.parent) sameLevel = false
                }


                if (sameLevel) this.selectedWidgets.push(widget)

            } else {

                this.selectedWidgets.splice(this.selectedWidgets.indexOf(widget), 1)

            }

        } else {

            this.selectedWidgets = [widget]

            if (!options.refresh && (widget.container.classList.contains('editing'))) return

        }

        this.unselect()

        if (this.selectedWidgets.length > 0) {

            this.createEditForm()
            this.createSelectionBlock()

        }

    }


    createEditForm(){

        var widget = this.selectedWidgets[0],
            props = this.defaults[widget.props.type]

        this.form.appendChild(DOM.create(`
            <div class="separator">
                ${this.selectedWidgets.length > 1 ?
                    '<span class="accent">Multiple Widgets</span>' :
                    '<span>Widget</span>'
                }
            </div>
        `))

        if (widget.props.type === 'root') {
            this.form.appendChild(DOM.create(`
                <div class="input-wrapper">
                    <label>id</label>
                    <input class="input" title="id" disabled value="root"/>
                </div>
            `))
        }



        for (let propName in props) {

            let field,
                shared = true

            for (var w of this.selectedWidgets) {
                if (this.defaults[w.props.type][propName] === undefined) {
                    shared = false
                }
            }

            if (!shared) continue

            if (propName.indexOf('_') == 0) {

                field = DOM.create(`<div class="separator"><span>${props[propName]}</span></div>`)

            } else if (widget.props[propName] === undefined) {

                continue

            } else {

                field = editField(this, widget, propName, props[propName])
                if (!field) continue

            }

            this.form.appendChild(field)

        }

        this.wrapper.appendChild(this.form)
        DOM.get('#editor')[0].appendChild(this.wrapper)

    }

    createSelectionBlock(){

        DOM.each(document, '.editing', (element)=>{
            element.classList.remove('editing')
        })

        for (var widget of this.selectedWidgets) {
            DOM.each(document, `[data-widget="${widget.hash}"]`, (item)=>{
                item.classList.add('editing')
            })
        }

        if (this.selectedWidgets.length == 1) {
            var widget = this.selectedWidgets[0]
            if (widget.props.height !== undefined || widget.props.width !== undefined) {

                var handleTarget
                var $container = $(widget.container)
                $container.resizable({
                    handles: 's, e, se',
                    helper: "ui-helper",
                    start: (event, ui)=>{
                        handleTarget = $(event.originalEvent.target)
                    },
                    resize: (event, ui)=>{
                        ui.size.height = Math.round(ui.size.height / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                        ui.size.width = Math.round(ui.size.width / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                    },
                    stop: (event, ui)=>{
                        if (handleTarget.hasClass('ui-resizable-se') || handleTarget.hasClass('ui-resizable-s')) widget.props.height = Math.round((Math.max(ui.size.height,1)) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH
                        if (handleTarget.hasClass('ui-resizable-se') || handleTarget.hasClass('ui-resizable-e')) widget.props.width =  Math.round(ui.size.width / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH
                        updateWidget(widget)
                    },
                    grid: [GRIDWIDTH * PXSCALE, GRIDWIDTH * PXSCALE]
                })

            }


            if (widget.props.top !== undefined) {
                var $container = $(widget.container)
                $container.draggable({
                    cursor:'-webkit-grabbing',
                    drag: (event, ui)=>{
                        ui.position.top = Math.round(ui.position.top / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                        ui.position.left = Math.round(ui.position.left / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                    },
                    stop: (event, ui)=>{
                        event.preventDefault()
                        widget.props.top = (ui.helper.position().top + $container.parent().scrollTop())/PXSCALE
                        widget.props.left = (ui.helper.position().left + $container.parent().scrollLeft())/PXSCALE
                        ui.helper.remove()
                        updateWidget(widget)
                    },
                    handle:'.ui-draggable-handle, > .label',
                    grid: [GRIDWIDTH * PXSCALE, GRIDWIDTH * PXSCALE],
                    helper:()=>{
                        return $('<div class="ui-helper"></div>').css({height:$container.outerHeight(),width:$container.outerWidth()})
                    }
                }).append('<div class="ui-draggable-handle"></div>')

            }
        }


    }

}

var editor = new Editor()

module.exports = editor

require('./context-menu')