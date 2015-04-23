var React       = require('react'),
    StyleSheet  = require('react-style'),
    MUI         = require('material-ui'),
    Paper       = MUI.Paper,
    TextField   = MUI.TextField,
    PopupSelect = require('../MaterialPopupSelect');

require('./style.less');

export default React.createClass({
    propTypes: {
        dataSource: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.string,
        ]),
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.array.isRequired,
            requestChange: React.PropTypes.func.isRequired
        }),
        multiple: React.PropTypes.bool,
        placeholder: React.PropTypes.string
    },

    componentDidMount: function() {

    },

    componentDidUpdate: function() {
        this._updateHintPosition();
    },

    getInitialState: function() {
        return {
            selected: []
        };
    },

    _updateHintPosition() {
        let tokenWrapper = this.refs.tokenWrapper;

        if (tokenWrapper) {
            let lastToken = this.refs["token-" + (tokenWrapper.props.children.length - 1)];
            this.refs.text.getDOMNode().style.marginTop = lastToken.getDOMNode().offsetTop + "px";
        }
        this.refs.hint.getDOMNode().style.top = this.refs.text.getDOMNode().offsetTop + 'px';
        this.refs.hint.getDOMNode().style.left = this.refs.text.getDOMNode().offsetLeft + 'px';
    },

    _addSelectedOption(value) {
        let selected = this.state.selected;
        if (selected.length === 0) {
            selected.push(value);
        } else {
            if (!this.props.multiple) {
                selected[0] = value;
            } else if (selected.indexOf(value) < 0) {
                selected.push(value);
            } else {
                return ;
            }
        }
        this.setState({selected: selected});
    },

    render: function() {
        let styles = {
            select: {
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
                width: 256
            },
            hint: {
                color: "#999"
            },
            token: {
                float: "left",
                marginRight: 4,
                marginBottom: 4,
                padding: "2px 8px"
            },
            tokenWrapper: {
                position: "absolute",
                top: 10
            },
            padding: {
                paddingLeft: this.state.paddingLeft || 2
            }
        };


        let tokens = [];
        let text = <TextField ref="text" style={styles.padding} type="text" className="select-text" />;
        let popupSelect = <PopupSelect
            ref="popupSelect"
            controller={this.refs.text}
            onItemSelect={(value) => {
                    this._addSelectedOption(value);
                    this.refs.text.setValue("");
                    this.refs.hint.setValue("");
                    this.refs.text.blur();
                }
            }
            onFocus={() => {
                    let tokenWrapper = this.refs.tokenWrapper;
                    let paddingLeft = 0;

                    if (tokenWrapper) {
                        let lastToken = this.refs["token-" + (tokenWrapper.props.children.length - 1)];
                        paddingLeft = lastToken.getDOMNode().offsetLeft + lastToken.getDOMNode().clientWidth + 4;
                        this.refs.text.getDOMNode().style.marginTop = lastToken.getDOMNode().offsetTop + "px";
                    } else {
                        paddingLeft = 2;
                    }
                    this.setState({paddingLeft: paddingLeft});
                }
            }
            onChange={(values) => {
                if (values[0] && values[0].indexOf(this.refs.text.getValue()) === 0) {
                    this.refs.hint.setValue(values[0]);
                } else {
                    this.refs.hint.setValue("");
                }
            }}
            onAutoComplete={(values) =>
                {
                    if (values[0] && values[0].indexOf(this.refs.text.getValue()) === 0) {
                        this.refs.text.setValue(values[0]);
                    } else {
                        this.refs.text.setValue("");
                    }
                }
            }>
            {this.props.children}
        </PopupSelect>;

        for (let i = 0; i < this.state.selected.length; i++) {
            tokens.push(<Paper ref={"token-" + i} zDepth={1} styles={styles.token}><a>{this.state.selected[i]}</a></Paper>);
        }

        let tokenWrapperDOM = tokens.length > 0 ? <div ref="tokenWrapper" styles={styles.tokenWrapper}>{tokens}</div> : null;
        return (
            <div styles={styles.select}>
                {tokenWrapperDOM}
                {text}
                {popupSelect}
                <TextField styles={[styles.hint, styles.padding]} ref="hint" type="text" className="select-hint" />
            </div>
        );
    }
});