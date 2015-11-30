/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    coffee: {
      app: {
        src: ['lib/models/**/*.coffee', 'lib/app.coffee'],
        dest: 'static/js/app.js'
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      vendor: {
        src: ['bower_components/d3/d3.js',
              'bower_components/c3/c3.js',
              'bower_components/underscore/underscore.js',
              'bower_components/jquery/dist/jquery.js'
             ],
        dest: 'static/js/vendor.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      app: {
        src: '<%= coffee.app.dest %>',
        dest: 'static/js/app.min.js'
      },
      vendor: {
        src: '<%= concat.vendor.dest %>',
        dest: 'static/js/vendor.min.js'
      }
    },
    less: {
      app: {
        files: {
          'static/stylesheets/app.css': 'less/app.less'
        }
      }
    },
    watch: {
      lib: {
        files: '<%= coffee.app.src %>',
        tasks: ['coffee']
      }
    },
    cacheBust: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 16,
        ignorePatterns: ['/ico/']
      },
      app: {
        files: [{
          src: 'index.html'
        }]
      }
    },
    cssmin: {
      app: {
        files: {
          'static/stylesheets/app.min.css': 'static/stylesheets/app.css'
        }
      }
    },
    clean: {
      build: {
        src: ['static/js/*.js', 'static/stylesheets/*.css']
      }
    },
    copy: {
      fonts: {
        expand: true,
        cwd: 'bower_components/font-awesome/fonts',
        src: "**",
        dest: 'static/fonts',
        filter: 'isFile'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-cache-bust');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', ['coffee', 'concat', 'less', 'copy', 'watch']);

};
