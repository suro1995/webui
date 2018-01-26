import React, { Component } from 'react';
import { AutoComplete, Input } from 'antd';
import _ from 'lodash';

const { Search } = Input;

function filterOption(inputValue, { props }) {
  const fold = _.last(inputValue.split('/'));
  return _.startsWith(props.children, fold);
}

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      value: props.value || '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSearchComponents = this.onSearchComponents.bind(this);
  }

  componentWillMount() {
    this.updateDataSource('');
  }

  onChange(value) {
    const { onChange = _.identity } = this.props;
    this.setState({ value });
    onChange(value);
    this.updateDataSource(value);
  }

  onSearchComponents() {
    if (_.isFunction(this.props.onSearchComponents)) {
      this.props.onSearchComponents(this.state.value);
    }
  }

  updateDataSource(value) {
    const { fetchSuggestion = _.identity } = this.props;
    fetchSuggestion(value, (dataSource) => {
      this.setState({ dataSource });
    });
  }

  render() {
    const { placeholder, style } = this.props;
    let inputType = null; // default is input
    if (_.isFunction(this.props.onSearchComponents)) {
      inputType = (
        <Search
          enterButton
          onSearch={this.onSearchComponents} //eslint-disable-line
        />);
    }
    return (
      <AutoComplete
        dataSource={this.state.dataSource}
        value={this.state.value}
        filterOption={filterOption}
        onChange={this.onChange}
        placeholder={placeholder}
        defaultActiveFirstOption={false}
        style={style}
        backfill={true} //eslint-disable-line
      >
        {inputType}
      </AutoComplete>
    );
  }
}
