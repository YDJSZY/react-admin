/**
 * Created by luwenwei on 17/9/3.
 */
import React from "react";
import { DatePicker } from 'antd';
import SelectComponent from './select';
import moment from 'moment';
import 'moment/locale/zh-cn';
const { RangePicker } = DatePicker;
const dateRangeSelect = require("../untils/dateRangeSelect");
moment.locale('zh-cn');
const namedDateRanges = [
    {value:"今天",name:"今天"},
    {value:"昨天",name:"昨天"},
    {value:"前天",name:"前天"},
    {value:"本周",name:"本周"},
    {value:"上周",name:"上周"},
    {value:"本月份",name:"本月份"},
    {value:"上个月",name:"上个月"},
    {value:"最近三个月",name:"最近三个月"},
    {value:"上个季度",name:"上个季度"},
    {value:"最近一年",name:"最近一年"},
    {value:"本季度",name:"本季度"},
    {value:"本年度",name:"本年度"},
    {value:"上一年度",name:"上一年度"},
    {value:"不限",name:"不限"},
    {value:"自定义",name:"自定义"}
];
const dateFormat = 'YYYY-MM-DD';
export default class DateRange extends React.Component {
    //static defaultProps = {
    //  name: 'Mary'  //定义defaultprops的另一种方式
    //}

    //static propTypes = {
    //name: React.PropTypes.string
    //}
    constructor (props) {
        super(props);
        this.state = {
            dateValue: [],
            disabledDateRange: true,
            selectDateRangeName: this.props.dateRangeName || "今天"
        };
    }

    dateRangeChange = (val, noReq) => {/*日期范围改变*/
        let dateRangeName = val;
        let dateRange = dateRangeSelect(dateRangeName);
        let arr = [moment(dateRange.begin_time,dateFormat),moment(dateRange.end_time,dateFormat)];
        this.emitDateRangeChange(dateRange,noReq);
        this.setState({
            selectDateRangeName: dateRangeName,
            dateValue:arr,
            disabledDateRange: dateRange.dateRangeName == "自定义" ? false : true
        })
    }

    rangePickerOnChange = (val) => {
        let dateRange = {begin_time: val[0], end_time: val[1]}
        this.setState({dateValue: val});
        this.emitDateRangeChange(dateRange)
    }

    emitDateRangeChange (dateRange, noReq) {
        this.props.onDateRangeChange(dateRange, noReq);/*触发父组件的日期选择回调*/
    }

    componentWillMount() {
    }

    componentDidMount(){
        console.log(this.props.dateRangeName)
        this.dateRangeChange(this.props.dateRangeName,true);
    }

    render() {
        let selectDateRangeName = this.state.selectDateRangeName || this.props.dateRangeName;
        return  <div style={{display:"inline-block"}}>
            <SelectComponent
                allowClear={false}
                optionValue="value"
                value={selectDateRangeName}
                style={{width:"110px"}}
                onSelect={this.dateRangeChange}
                source={namedDateRanges}>
            </SelectComponent>
            <RangePicker
                value={this.state.dateValue}
                onChange={this.rangePickerOnChange}
            />
        </div>
    }
}