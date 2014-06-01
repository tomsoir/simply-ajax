mountFolder = ( connect, dir ) ->
    return connect.static(require('path').resolve(dir))

module.exports = (grunt) ->
    grunt.initConfig
        uglify: 
            options: 
                compress: 
                    global_defs: 
                        "DEBUG": false
                    dead_code: true
            my_target:
                files: 
                    'build/sAjax.min.js': ['dev/sAjax.js']

        grunt.loadNpmTasks('grunt-contrib-uglify')

        grunt.registerTask 'build', ['uglify']

