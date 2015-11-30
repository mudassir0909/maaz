class @Examination
  constructor: (@title) ->
    @results = []
    @id = App.examinations.length + 1

  addGrade: (grade, subject_id) ->
    @results.push new Grade(grade, subject_id)
    @updateGPA()

  updateGPA: ->
    grade_sum = _(@results).reduce (sum, result) ->
      sum + result.grade
    , 0
    @gpa = Number((grade_sum / @results.length).toFixed(2))
