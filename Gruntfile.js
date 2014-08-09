'use strict';

module.exports = function (grunt) {
  var globals = {
    src: 'src',
    dist: 'dist'
  };

  grunt.initConfig({
    globals: globals,
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= globals.dist %>/{,*/}*.html',
          '<%= globals.dist %>/assets/styles/main.css'
        ],
      },
      templates: {
        files: ['<%= globals.src %>/**/*.hbs', '<%= globals.src %>/**/*.md', '<%= globals.src %>/**/*.json'],
        tasks: ['newer:assemble']
      },
      styles: {
        files: ['<%= globals.src %>/assets/styles/less/**/*.less'],
        tasks: ['less:dev']
      }
    },

    assemble: {
      options: {
        assets: '<%= globals.dist %>/assets',
        data: ['<%= globals.src %>/templates/data/*.{json,yml}'],
        flatten: true,
        helpers: ['<%= globals.src %>/templates/helpers/helper-*.js'],
        layout: 'default.hbs',
        layoutdir: '<%= globals.src %>/templates/layouts',
        partials: ['<%= globals.src %>/templates/includes/**/*.hbs']
      },
      pages: {
        files: {
          '<%= globals.dist %>/': ['<%= globals.src %>/templates/*.hbs']
        }
      },
      posts: {
        options: {
          layout: 'blog.hbs'
        },
        files: {
          '<%= globals.dist %>/blog/': ['<%= globals.src %>/templates/posts/*.md']
        }
      }
    },

    less: {
      dev: {
        options: {
          paths: '<%= globals.src %>/assets/styles/less'
          // sourceMap: true,
          // sourceMapFilename: '<%= globals.dist %>/assets/styles/main.css.map',
          // sourceMapURL: '/main.css.map',
          // sourceMapBasepath: 'less',
          // sourceMapRootpath: '/'
        },
        files: {
          '<%= globals.dist %>/assets/styles/main.css': '<%= globals.src %>/assets/styles/less/main.less'
        }
      },
      prod: {
        options: {
          paths: '<%= globals.src %>/assets/styles/less',
          cleancss: true
        },
        files: {
          '<%= globals.dist %>/assets/styles/main.css': '<%= globals.src %>/assets/styles/less/main.less'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      dev: {
        options: {
          map: true
        },
        src: '<%= globals.dist %>/assets/styles/main.css'
      },
      prod: {
        src: '<%= globals.dist %>/assets/styles/main.css'
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          livereload: true,
          open: true,
          base: [
            '<%= globals.dist %>/',
            '<%= globals.src %>/assets/styles/'
          ]
        }
      }
    },

    clean: {
      full: ['<%= globals.dist %>', '!<%= globals.dist %>/.gitkeep']
    }
  });

  grunt.loadNpmTasks('assemble');
  require('load-grunt-tasks')(grunt);

  // Register tasks
  grunt.registerTask('default', ['clean:full', 'assemble', 'less:dev', 'autoprefixer:dev']);
  grunt.registerTask('build', ['clean:full', 'assemble', 'less:prod', 'autoprefixer:prod']);
  grunt.registerTask('serve', ['default', 'connect', 'watch']);
};
