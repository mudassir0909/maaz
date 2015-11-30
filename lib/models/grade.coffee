class @Grade
  constructor: (@grade, subject_id) ->
    @subject = _(App.subjects).findWhere({id: subject_id});

    throw 'Invalid subject_id' unless @subject?
