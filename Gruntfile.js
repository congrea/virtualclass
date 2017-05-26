module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //concat : {
        //    css : {
        //        src: ['css/white/*'],
        //        dest: 'css/white.combined.css'
        //    }
        //},

        cssmin: {
            css_w: {
                src: ['css/white/styles.css', 'css/white/popup.css', 'css/white/jquery.ui.chatbox.css', 'css/white/vceditor.css'],
                dest: 'css/white.min.css'
            }
            ,
            css_g: {
                src: ['css/gray/styles.css', 'css/gray/popup.css', 'css/gray/jquery.ui.chatbox.css', 'css/gray/vceditor.css'],

                dest: 'css/gray.min.css'
            },
            css_b: {
                src: ['css/black/styles.css', 'css/black/popup.css', 'css/black/jquery.ui.chatbox.css', 'css/black/vceditor.css'],

                dest: 'css/black.min.css'
            }
        },

        handlebars: {
            all: {

              files: {

                // converting all .hbs(handlerbar template file ) into all.js file
                // you can change the directory according to your requirement
                "src/templates_view.js": ["templates/**/*.hbs"]
              }
            }
          },

          watch: {
            /** the grunt is waching if any changes in .hbs files
             *  if so there will be peform the task hanldebars which does precompile (.hbs to .js)
             *  **/
            templates : {
              files: ["templates/*.hbs"],
              tasks: ['handlebars']
            },

            tasks: ['handlebars']
          }


    });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['handlebars']);
  grunt.registerTask('default', ['handlebars']);

};
