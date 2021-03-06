const React = require("react");
const Flex = require("../../Flex");
const Common = require('../../Common');
const LoginStore = require('../../../stores/LoginStore');
const ActivityUserStore = require('../../../stores/ActivityUserStore');
const Member = require('../../Member');
const SummaryInfo = require('./SummaryInfo');
const Link = require('react-router').Link;
const mui = require("material-ui");

module.exports = React.createClass({

    getInitialState() {
        return {
            user: ActivityUserStore.getCurrentUser()
        };
    },
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render(){
        if(!this.state.user){
            return null;
        }
        let user = LoginStore.getUser();
        let my = this.props.my;
        let attended = this.props.attended;
        let applied = this.props.applied;
        return <Flex.Layout vertical centerJustified>
                    <Member.Avatar scale={8} member={user}/> <br/>
                    <Flex.Layout centerJustified>
                        <Member.Name style={{fontSize: 16}} member={user}/>
                    </Flex.Layout>
                    <Common.Hr style={{margin: '12px 5px'}}/>
                    <Flex.Layout centerJustified>
                        <Common.Display type='subhead' style={{color:this.context.muiTheme.palette.primary1Color}} title="Total">{this.state.user.point_total}</Common.Display>
                        <Common.Display type='subhead' style={{marginLeft:5}}>Points</Common.Display>
                    </Flex.Layout>
                    <Common.Hr style={{margin: '12px 5px'}}/>
                    <Flex.Layout centerJustified style={{height: '100%'}}>
                        <SummaryInfo number={{my}} text={"Given"} title={"As speaker"}/>
                        <SummaryInfo number={{applied}} text={"Applied"} title={"Registered as audience"}/>
                        <SummaryInfo number={{attended}} text={"Attended"} title={"Joint as audience"}/>
                    </Flex.Layout>
            </Flex.Layout>;
    }
});
