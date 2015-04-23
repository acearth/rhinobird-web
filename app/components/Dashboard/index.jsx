const React = require("react");
const DashboardRecord = require('./DashboardRecord');
const InfiniteScroll = require('../InfiniteScroll');

if ($.mockjax) {
    $.mockjax({
        url: '/api/dashboard_records',
        type: 'GET',
        responseText: [{
            creator: '1',
            content: 'I like apple'
        }, {
            creator: '2',
            content: 'I like orange'
        }, {
            creator: '3',
            content: 'I like banana'
        }, {
            creator: '4',
            content: "I don't like fruits"
        }]
    });
}

require('./style.less');
module.exports = React.createClass({
    getInitialState(){
        return {
            dashboardRecords: []
        }
    },
    componentWillMount(){
        $.get('/api/dashboard_records').then((data)=> {
            this.setState({
                dashboardRecords: data
            })
        });
    },
    componentDidMount() {
        this.props.setTitle("Dashboard");
    },
    render: function () {
        return <div className="dashboard">
            <InfiniteScroll lowerThreshold={300} onLowerTrigger={()=>{
                this.setState({
                    dashboardRecords: this.state.dashboardRecords.concat([{
            creator: '1',
            content: 'I like apple'
        }])
                })
            }} scrollTarget={()=>{
                return this.getDOMNode().parentNode;
            }}/>
            <hr />
            {this.state.dashboardRecords.map((record, index)=> {
                return <div key={index}>
                    <DashboardRecord creator={record.creator} content={record.content}/>
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content}/>
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content}/>
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content}/>
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content}/>
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content}/>
                    <hr/>
                </div>
            })}
        </div>;
    }
});