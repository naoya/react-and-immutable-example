var React     = require('react/addons');
var Immutable = require('immutable');

var Todo = Immutable.Record({
  id: undefined,
  text: undefined,
  complete: false
});

var App = React.createClass({
  getInitialState: function() {
    return {
      todos: Immutable.List([])
    };
  },
  render: function() {
    return (
      <div>
        <h1>Todos</h1>
        <TodoInput onSave={this._onSave} />
        <TodoList todos={this.state.todos} />
      </div>
    );
  },
  _onSave: function(text) {
    if (text !== '') {
      var todo = new Todo({
        id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
        text: text
      });
      this.setState({ todos: this.state.todos.push(todo) });
    }
  }
});

var TodoInput = React.createClass({
  mixins: [ React.addons.LinkedStateMixin ],
  propTypes: {
    onSave: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return { textValue: '' };
  },
  _onKeyDown: function(e) {
    if (e.keyCode === 13) {
      this.props.onSave(this.state.textValue);
      this.setState({ textValue: '' });
    }
  },
  render: function() {
    return <input type="text"
                  onKeyDown={this._onKeyDown}
                  valueLink={this.linkState('textValue')}
                  autoFocus="true" />;
  }
});

var TodoList = React.createClass({
  mixins: [ React.addons.PureRenderMixin ],
  propTypes: {
    todos: React.PropTypes.object.isRequired,
  },
  render: function() {
    var todos = this.props.todos.map(function(todo) {
      return <li key={todo.id}>{todo.text}</li>;
    });
    return <ul>{todos}</ul>;
  }
});

React.render(
  <App />,
  document.getElementById('app-container')
);
