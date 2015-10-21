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
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['cssmin:css_w', 'cssmin:css_g', 'cssmin:css_b',  'concat:css']);
};
