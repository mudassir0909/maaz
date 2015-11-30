(function() {
  this.Examination = (function() {
    function Examination(title) {
      this.title = title;
      this.results = [];
      this.id = App.examinations.length + 1;
    }

    Examination.prototype.addGrade = function(grade, subject_id) {
      this.results.push(new Grade(grade, subject_id));
      return this.updateGPA();
    };

    Examination.prototype.updateGPA = function() {
      var grade_sum;
      grade_sum = _(this.results).reduce(function(sum, result) {
        return sum + result.grade;
      }, 0);
      return this.gpa = Number((grade_sum / this.results.length).toFixed(2));
    };

    return Examination;

  })();

}).call(this);

(function() {
  this.Grade = (function() {
    function Grade(grade, subject_id) {
      this.grade = grade;
      this.subject = _(App.subjects).findWhere({
        id: subject_id
      });
      if (this.subject == null) {
        throw 'Invalid subject_id';
      }
    }

    return Grade;

  })();

}).call(this);

(function() {
  this.Subject = (function() {
    function Subject(title) {
      this.title = title;
      this.id = App.subjects.length + 1;
    }

    return Subject;

  })();

}).call(this);

(function() {
  var slice = [].slice;

  this.App = (function() {
    function App() {}

    App.subjects = [];

    App.examinations = [];

    App.init = function() {
      this.createSubjects('First Language', 'Second Language', 'English', 'Mathematics', 'Science', 'Social');
      this.recordResults('Formative Assessment 1', [8, 9, 8, 8, 8, 5]);
      return this.recordResults('Quarterly', [8, 8, 7, 7, 5, 7]);
    };

    App.render = function() {
      this.renderGPA();
      this.renderChartForExaminations();
      return this.renderSubjectWiseCharts();
    };

    App.createSubject = function(title) {
      var subject;
      subject = new Subject(title);
      App.subjects.push(subject);
      return subject;
    };

    App.createSubjects = function() {
      var titles;
      titles = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return _(titles).each(this.createSubject);
    };

    App.createExamination = function(title) {
      var examination;
      examination = new Examination(title);
      this.examinations.push(examination);
      return examination;
    };

    App.recordResults = function(examination_title, grades) {
      var examination;
      examination = this.createExamination(examination_title);
      return _(this.subjects).each(function(subject, index) {
        return examination.addGrade(grades[index], subject.id);
      });
    };

    App.renderGPA = function() {
      var $gpa_container, examination, html, template;
      $gpa_container = $('#gpa');
      template = '<b>Recent GPA: <%= gpa %> (<%= title %>)</b>';
      examination = _(this.examinations).last();
      html = _.template(template)(_(examination).pick('gpa', 'title'));
      return $gpa_container.html(html);
    };

    App.renderChartForExaminations = function() {
      var columns;
      columns = _(this.examinations).map(function(examination) {
        var column;
        column = [examination.title];
        _(examination.results).each(function(result) {
          return column.push(result.grade);
        });
        return column;
      });
      return c3.generate({
        bindto: '#chart',
        data: {
          columns: columns
        },
        axis: {
          x: {
            type: 'category',
            categories: _(this.subjects).pluck('title')
          },
          y: {
            max: 10,
            min: 0,
            padding: {
              top: 0,
              bottom: 0
            }
          }
        }
      });
    };

    App.renderSubjectWiseCharts = function() {
      var $panels_container, exam_labels, template;
      $panels_container = $('#panels-container');
      template = "<div class=\"panel panel-<%= panel_type %>\">\n  <div class=\"panel-heading\">\n    <h5 class=\"panel-title\"><%= title %> <i class=\"fa fa-lg fa-<%= icon_type %>\"></i></h5>\n  </div>\n\n  <div class=\"panel-body\">\n    <div id=\"chart-<%= id %>\"></div>\n  </div>\n</div>";
      exam_labels = _(this.examinations).pluck('title');
      return _(this.subjects).each((function(_this) {
        return function(subject) {
          var columns, delta, html, icon_type, panel_type, tooltip;
          columns = [subject.title];
          _(_this.examinations).each(function(examination) {
            var grade;
            grade = _(examination.results).findWhere({
              subject: subject
            }).grade;
            return columns.push(grade);
          });
          delta = columns[columns.length - 1] - columns[columns.length - 2];
          if (delta > 0) {
            panel_type = 'success';
            tooltip = 'Improvement from the previous examination';
            icon_type = 'smile-o';
          } else if (delta < 0) {
            panel_type = 'danger';
            tooltip = 'Decline from the previous examination';
            icon_type = 'frown-o';
          } else {
            panel_type = 'default';
            tooltip = 'No change from the previous examination';
          }
          html = _.template(template)({
            title: subject.title,
            id: subject.id,
            panel_type: panel_type,
            tooltip: tooltip,
            icon_type: icon_type
          });
          $panels_container.append(html);
          return c3.generate({
            bindto: "#chart-" + subject.id,
            data: {
              columns: [columns]
            },
            axis: {
              x: {
                type: 'category',
                categories: exam_labels
              },
              y: {
                max: 10,
                min: 0,
                padding: {
                  top: 0,
                  bottom: 0
                }
              }
            }
          });
        };
      })(this));
    };

    return App;

  })();

}).call(this);
