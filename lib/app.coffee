class @App
  @subjects: []
  @examinations: []

  @init: ->
    #populating the data
    @createSubjects('First Language', 'Second Language', 'English', 'Mathematics', 'Science', 'Social')
    @recordResults('Formative Assessment 1', [8, 9, 8, 8, 8, 5])
    @recordResults('Formative Assessment 2', [9, 8, 8, 7, 7, 9])
    @recordResults('Quarterly', [8, 8, 7, 7, 5, 7])
    @recordResults('Formative Assessment 3', [9, 9, 8, 7, 8 ,9])
    @recordResults('Half Yearly', [9, 7, 7, 5, 9 ,9])
    @recordResults('Formative Assessment 4', [9, 9, 8, 8, 8, 9])

  @render: ->
    @renderGPA()
    @renderChartForExaminations()
    @renderSubjectWiseCharts()

  @createSubject: (title) =>
    subject = new Subject(title)
    @subjects.push(subject)
    subject

  @createSubjects: (titles...) ->
    _(titles).each(@createSubject)

  @createExamination: (title) ->
    examination = new Examination(title)
    @examinations.push(examination)
    examination

  @recordResults: (examination_title, grades) ->
    examination = @createExamination(examination_title)

    _(@subjects).each (subject, index) ->
      examination.addGrade(grades[index], subject.id)

  @renderGPA: ->
    $gpa_container = $('#gpa')
    template = '<b>Recent GPA: <%= gpa %> (<%= title %>)</b>'
    examination = _(@examinations).last()
    html = _.template(template)(_(examination).pick('gpa', 'title'))

    $gpa_container.html(html)

  @renderChartForExaminations: ->
    columns = _(@examinations).map (examination) ->
      column = [examination.title]

      _(examination.results).each (result) -> column.push(result.grade)

      column


    c3.generate
      bindto: '#chart',
      data: {
          columns: columns
      },
      axis: {
          x: {
              type: 'category',
              categories: _(@subjects).pluck('title')
          },
          y: {
              max: 10,
              min: 0,
              padding: {top: 0, bottom: 0}
          }
      }

  @renderSubjectWiseCharts: ->
    $panels_container = $('#panels-container')
    template = """
                <div class="panel panel-<%= panel_type %>">
                  <div class="panel-heading">
                    <h5 class="panel-title"><%= title %> <i class="fa fa-lg fa-<%= icon_type %>"></i></h5>
                  </div>

                  <div class="panel-body">
                    <div id="chart-<%= id %>"></div>
                  </div>
                </div>
               """
    exam_labels = _(@examinations).pluck('title')

    _(@subjects).each((subject) =>
      columns = [subject.title]

      _(@examinations).each (examination) ->
        grade = _(examination.results).findWhere({subject: subject}).grade

        columns.push(grade)

      delta = columns[columns.length - 1] - columns[columns.length - 2]

      if (delta > 0)
          panel_type = 'success'
          tooltip = 'Improvement from the previous examination'
          icon_type = 'smile-o'
      else if (delta < 0)
          panel_type = 'danger'
          tooltip = 'Decline from the previous examination'
          icon_type = 'frown-o'
      else
          panel_type = 'default'
          tooltip = 'No change from the previous examination'

      html = _.template(template)
        title: subject.title,
        id: subject.id,
        panel_type: panel_type,
        tooltip: tooltip,
        icon_type: icon_type

      $panels_container.append(html)

      c3.generate
        bindto: "#chart-#{subject.id}"
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
            padding: {top: 0, bottom: 0}
          }
        }
    )
