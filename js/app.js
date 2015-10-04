window.App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();
App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'todos-emberjs'
});

App.Router.map(function() {
  this.resource('todos', { path: '/' }, function () {
    this.route('active');
    this.route('completed');
  });
});

App.TodosRoute = Ember.Route.extend ({
  model: function () {
    return this.store.find('todo');
  }
});

App.TodosIndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('todos');
  }
});

App.TodosActiveRoute = Ember.Route.extend({
  model: function() {
    return this.store.filter('todo', function (todo){
      return !todo.get('isCompleted');
    });
  },
  renderTemplate: function(controller) {
    this.render('todos/index', {controller: controller});
  }
});

App.TodosCompletedRoute = Ember.Route.extend({
  model: function() {
    return this.store.filter('todo', function(todo){
      return todo.get('isCompleted');
    });
  },
  renderTemplate: function(controller) {
    this.render('todos/index', {controller: controller});
  }
});

App.Todo = DS.Model.extend({
  title: DS.attr('string'),
  isCompleted: DS.attr('boolean')
});


App.Todo.FIXTURES = [
  {
    id: 1,
    title: 'Compléter le todo avec EmberJs',
    isCompleted: false
  },
  {
    id: 2,
    title: 'Apprendre Gulp',
    isCompleted: true
  },
  {
    id: 3,
    title: 'Le todo en Angular2',
    isCompleted: true
  },
  {
    id: 4,
    title: 'Etre patiente ! :)',
    isCompleted: false
  }
];

App.TodosController = Ember.ArrayController.extend({
  actions: {
    createTodo: function() {
      var title = this.get('newTitle');
      //if(!title) { return false; }
      if(!title.trim()) { return; }

      var todo = this.store.createRecord('todo', {
        title: title,
        isCompleted: false
      });

      this.set('newTitle', '');

      todo.save();
    },
    clearCompleted: function() {
      var completed = this.filterProperty('isCompleted', true);
      completed.invoke('deleteRecord');
      completed.invoke('save');
    }
  },
  /*isCompleted: function(key, value) {
    var model = this.get('model');

    if (value === undefined) {
      return model.get('isCompleted');
    } else {
      model.set('isCompleted', value);
      model.save();
      return value;
    }
  }.property('model.isCompleted'),*/

  remaining: function() {
    return this.filterProperty('isCompleted', false).get('length');
  }.property('@each.isCompleted'),

  inflection: function() {
    var remaining = this.get('remaining');
    return remaining === 1 ? 'tâche' : "tâches";
  }.property('remaining'),

  hasCompleted: function() {
    return this.get('completed') > 0;
  }.property('completed'),

  completed: function() {
    return this.filterProperty('isCompleted', true).get('length');
  }.property('@each.isCompleted'),

  allAreDone: function(key, value) {
      if(value === undefined) {
        return !this.get('length') && this.everyProperty('isCompleted', true);
      } else {
        this.setEach('isCompleted', value);
        this.invoke('save');
        return value;
      }
  }.property('@each.isCompleted')
});

App.TodoController = Ember.ObjectController.extend({
    actions: {
      editTodo: function() {
        this.set('isEditing', true);
      },

      acceptChanges: function() {
        this.set('isEditing', false);

        if (Ember.isEmpty(this.get('model.title'))) {
          this.send('removeTodo');
          } else {
            this.get('model').save();
          }
        },

      removeTodo: function () {
        var todo = this.get('model');
        todo.deleteRecord();
        todo.save();
      }
    },

    isEditing: false,

    isCompleted: function(key, value) {
      var model = this.get('model');

      if(value === undefined) {
        return model.get('isCompleted');
      } else {
        model.set('isCompleted', value);
        model.save();
        return value;
      }
    }.property('model.isCompleted')
});

App.EditTodoView = Ember.TextField.extend({
  didInsertElement: function() {
    this.$().focus();
  }
});

Ember.Handlebars.helper('edit-todo', App.EditTodoView);
