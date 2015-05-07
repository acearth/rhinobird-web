const React = require('react');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        valueAttr: React.PropTypes.string,
        activeStyle: React.PropTypes.object,
        activeClass: React.PropTypes.string,
        disabledStyle: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            valueAttr: "name",
            activeStyle: {
                fontWeight: "bold"
            },
            disabledStyle: {
                color: "#888"
            },
            activeClass: "active"
        };
    },

    getInitialState() {
        return {
            visible: true,
            options: {},
            optionsMap: [],
            activeOptionIndex: -1
        }
    },

    componentDidMount() {
        this._parse(this.props);
        window.addEventListener("keydown", this._windowKeyDownListener);
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this._parse(nextProps);
        }
    },

    componentWillUnmount() {
        window.removeEventListener("keydown", this._windowKeyDownListener);
    },

    cursorUp() {
        let optionsMap = this.state.optionsMap;
        let activeOptionIndex = this.state.activeOptionIndex;
        if (activeOptionIndex > 0) {
            this.setState({activeOptionIndex: activeOptionIndex - 1});
        } else {
            this.setState({activeOptionIndex: optionsMap.length - 1});
        }
    },

    cursorDown() {
        let optionsMap = this.state.optionsMap;
        let activeOptionIndex = this.state.activeOptionIndex;

        if (activeOptionIndex < optionsMap.length - 1) {
            activeOptionIndex = activeOptionIndex + 1;
        } else {
            activeOptionIndex = 0;
        }
        this.setState({activeOptionIndex: activeOptionIndex});
    },

    hide() {
        this.setState({visible: false});
    },

    show() {
        this.setState({visible: true});
    },

    render: function() {
        let styles = {
            popup: {
                display: this.state.visible ? "block" : "none"
            }
        };

        let children = this._construct(this.props.children, this.props.valueAttr);

        return (
            <div style={styles.popup}>{children}</div>
        );
    },

    _parse(props) {
        let children = [].concat(props.children);
        let valueAttr = props.valueAttr;
        let options = {};

        for (let i = 0; i < children.length; i++) {
            this._parseChild(children[i], valueAttr, options);
        }

        let index = 0;
        let optionsMap = Object.keys(options).filter((option) => {
            if (!options[option].disabled) {
                options[option].index = index++;
                return true;
            }
            return false;
        });
        this.setState({options: options, optionsMap: optionsMap});
    },

    _parseChild(child, valueAttr, options) {
        if (!child.props) {
            return;
        }
        if (child.props[valueAttr]) {
            let value = child.props[valueAttr].toString();
            if (!options[value]) {
                options[value] = {};
                if (child.props.disabled) {
                    options[value].disabled = true;
                }
            }
        } else {
            if (child.props.children) {
                let children = [].concat(child.props.children);
                for (let i = 0; i < children.length; i++) {
                    this._parseChild(children[i], valueAttr, options);
                }
            }
        }
    },

    _construct(children, valueAttr) {
        return [].concat(children).map(child => {
            return this._constructChild(child, valueAttr);
        });
    },

    _constructChild(child, valueAttr) {
        if (child.props) {
            if (child.props[valueAttr]) {
                let value = child.props[valueAttr].toString();
                let disabled = !!child.props.disabled;
                let style;
                if (disabled) {
                    style = this.props.disabledStyle;
                } else {
                    style = this.state.options[value] && this.state.options[value]["index"] === this.state.activeOptionIndex ? this.props.activeStyle : null;
                }
                return React.cloneElement(child, {
                    key: value,
                    style: style,
                    onMouseOver: () => this.setState({activeOptionIndex: this.state.options[value].index})
                });
            } else if (child.props.children) {
                let children = [].concat(child.props.children);

                return React.cloneElement(child, {
                    children: children.map((c) => {
                        return this._constructChild(c, valueAttr)
                    })
                });
            }
        } else {
            return child;
        }
    },

    _windowKeyDownListener(e) {
        if (this.state.visible) {
            let keyCode = e.keyCode;
            switch (keyCode) {
                case 38:    // Up
                    e.preventDefault();
                    this.cursorUp();
                    break;
                case 40:    // Down
                    e.preventDefault();
                    this.cursorDown();
                    break;
                case 13:    // Enter
                    e.preventDefault();
                    break;
                case 27:    // Escape
                    event.preventDefault();
                    break;
                case 9:
                    event.preventDefault();
                    this.cursorDown();
                    break;
                default:
                    break;
            }
        }
    }
});

