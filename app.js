(function() {
    var subjects = [];
    var examinations = [];

    function Subject(title) {
        this.title = title;
        this.id = subjects.length + 1;
    }

    function Examination(title) {
        this.results = [];
        this.title = title;
        this.id = examinations.length + 1;
    }

    Examination.prototype.addGrade = function(grade, subject_id) {
        this.results.push(new Grade(grade, subject_id));
    };

    function Grade(grade, subject_id) {
        this.grade = grade;
        this.subject = _(subjects).findWhere({id: subject_id});

        if (!this.subject) {
            throw "Invalid subject_id";
        }
    }

    function createSubject(title) {
        var subject = new Subject(title);

        subjects.push(subject);

        return subject;
    }

    function createSubjects() {
        var titles = [].slice.call(arguments);

        _(titles).each(createSubject);
    }

    function createExamination(title) {
        var examination = new Examination(title);

        examinations.push(examination);

        return examination;
    }

    function recordResults(examination_title, grades) {
        var examination = createExamination(examination_title);

        _(subjects).each(function(subject, index) {
            examination.addGrade(grades[index], subject.id);
        });
    }

    function renderChartForExaminations() {
        var columns = _(examinations).map(function(examination) {
            var column = [examination.title];

            _(examination.results).each(function(result) {
                column.push(result.grade);
            });

            return column;
        });

        c3.generate({
            bindto: '#chart',
            data: {
                columns: columns
            },
            axis: {
                x: {
                    type: 'category',
                    categories: _(subjects).pluck('title')
                }
            }
        });
    }

    // Populating the data
    createSubjects('First Language', 'Second Language', 'English', 'Mathematics', 'Science', 'Social');
    recordResults('Formative Assessment 1', [8, 9, 8, 8, 8, 5]);
    recordResults('Quarterly', [8, 8, 7, 7, 5, 7]);
    // recordResults('Formative Assessment 3 (Projected)', [8, 8, 7, 7, 8, 8]);

    window.onload = function () {
        renderChartForExaminations()
    };
})();
