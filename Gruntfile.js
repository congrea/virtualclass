module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // concat : {
    //    css : {
    //        src: ['css/white/*'],
    //        dest: 'css/white.combined.css'
    //    }
    // },

    cssmin: {
      css_b: {
        src: ['css/modules/styles.css', 'css/modules/popup.css', 'css/modules/vceditor.css', 'css/modules/document-share.css', 'css/modules/editor.css',
          'css/modules/icon.css', 'css/modules/media.css', 'css/modules/poll.css', 'css/modules/quiz.css', 'css/modules/screenshare.css',
          'css/modules/sharepresentation.css', 'css/modules/video.css', 'css/modules/peervideo.css', 'css/modules/whiteboard.css', 'css/modules/youtube.css',
          'css/modules/black_jquery-ui.css', 'css/modules/progress.css', 'css/modules/pbar.css', 'css/modules/dashboard.css', 'css/modules/dashboard.css',
          'css/modules/dbPpt.css', 'css/modules/dbVideo.css', 'css/modules/multivideo.css', 'ask-question.css',
          'css/modules/right-sidebar.css', 'css/modules/network.css', 'css/modules/main-container-layout.css', 'css/modules/color.css',
          'css/modules/custom.css', 'css/modules/jquery.ui.chatbox.css', 'css/modules/askQuestion.css'],

        dest: 'build/css/modules.min.css',
      },

      external_css: {
        src: ['external/css/codemirror.css', 'external/css/poll-c3.css', 'external/css/video-js.css'],
        dest: 'build/css/external.min.css',
      },

      bootstrap_css: {
        src: ['css/bootstrap/css/bootstrap.css'],
        dest: 'css/bootstrap/css/bootstrap.min.css',
      },

      sliqquiz: {
        src: 'external/css/slickQuiz.css',
        dest: 'external/css/slickQuiz.min.css',
      },

      fineuploader: {
        src: 'external/css/fine-uploader-gallery.css',
        dest: 'external/css/fine-uploader-gallery.min.css',
      },
    },

    handlebars: {
      all: {
        files: {
          // converting all .hbs(handlerbar template file ) into all.js file
          // you can change the directory according to your requirement
          'src/templates_view.js': ['dest_temp/templates/**/*.hbs'],
        },
      },
    },

    htmlcompressor: {
      compile: {
        expand: true,
        src: ['templates/**/*.hbs'],
        dest: 'dest_temp/',
        options: {
          type: 'html',
          preserveServerScript: true,
          // removeQuotes           : true,  //Remove unneeded quotes
          removeIntertagSpaces: true,
          // removeSurroundingSpaces: 'min'

        },
      },
    },

    sass: {
      dev: {
        src: 'scss/theme-gray.scss',
        dest: 'css/theme/gray.css',
      },

    },

    watch: {
      /** the grunt is waching if any changes in .hbs files
       *  if so there will be peform the task hanldebars which does precompile (.hbs to .js)
       *  * */
      templates: {
        files: ['dest_templates/templates/**/*.hbs'],
        tasks: ['handlebars'],
      },
      css: {
        files: '**/*.scss',
        tasks: ['sass'],
      },
      tasks: ['handlebars', 'sass'],
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-htmlcompressor');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['htmlcompressor', 'task_handlebars']);
  grunt.registerTask('mincss', ['cssmin']);
  grunt.registerTask('task_handlebars', 'create handle bar', function () {
    const done = this.async();
    setTimeout(() => {
      grunt.task.run('handlebars');
      done();
    }, 2000);
  });
};
