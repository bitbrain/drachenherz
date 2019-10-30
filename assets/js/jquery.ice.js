/**
 * Jquery plugin to display icy particle effects
 *
 * @author Miguel Gonzalez <miguel-gonzalez@gmx.de>
 * @since 1.0
 * @version 1.0
 */

  (function($) {

 	$.fn.extend({

 		ice : function(options) {

 			var defaults = {
                particles : 700,
                delay : 300,
                life : 1000,
                velocity : 52.5
            };

            var options = $.extend(true, {}, defaults, options);

            var width = $(this).width();
            var height = $(this).height();

            $(this).append('<canvas width="' + width + '" height="' + height + '" id="canvas"></canvas>');
            var context = $('#canvas').get(0).getContext('2d');

            function Particle(x, y, r, g, b, size) {

            	this.x = x;
            	this.y = y;
            	this.size = size;
            	this.r = r;
            	this.g = g;
            	this.b = b;
            	this.a = 0.0;
            	this.behavior = null;
            	this.flare = 0;

            	this.update = function(delta) {
            		this.behavior.update(delta);
            	}

            	this.draw = function(context) {

            		var flareFactor = Math.random() * 0.005;

            		flareFactor *= (Math.random() < 0.5) ? -1 : 1;

            		this.flare += flareFactor;


            		context.globalAlpha = this.a + this.flare;
            		context.fillStyle = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
            		context.beginPath();
            		context.arc(this.x + this.size / 2, this.y + this.size / 2, size / 2, 0, 2 * Math.PI, false);
            		context.fill();
            	}

            }

            // Sets a new particle position
            function realignParticle(particle) {

            	particle.x = Math.random() * width / 1.5 + (((width  - width / 1.5) / 2));
            	particle.y = Math.random() * height / 4 + height / 3 * 1.5;
            	particle.a = 0;
            }

            function ParticleBehavior(particle) {

            	this.delay = 0;
            	this.veloX = 0;
            	this.startVelocity = 0.1 * Math.random() + 0.01;
            	this.delayRange = options.delay + Math.random() * 20000;
            	this.opacityFactor = Math.random() * 0.02;
            	this.life = 0;
            	this.maxOpacity = 0.15 + 0.7 * Math.random();

            	this.update = function(delta) {
            		if (this.delay > this.delayRange) {
            			this.life += delta;
            			particle.y -= delta * this.startVelocity * Math.random();
            			if (this.life < 3000) {
            				if (particle.a < this.maxOpacity) {

            					particle.a += this.opacityFactor;
            				}
            			} else {
            				particle.a -= this.opacityFactor;
            				if (particle.a < 0) {
            					particle.a = 0;
            				}
            			}

            			var factorX = Math.random() * 0.05;
		                factorX *= (Math.random() > 0.5) ? 1 : -1;
		                this.veloX += factorX;

		            	particle.x += this.veloX;

            			if (particle.y < 0 || particle.a == 0) {
            				realignParticle(particle);
            				this.delay = 0;
            				this.delayRange = options.delay + Math.random() * 20000;
            				this.veloX = 0;
            				this.life = 0;
            				this.maxOpacity = 0.2 + 0.4 * Math.random();
            			}
            		} else {
            			this.delay+= delta;
            		}
            	}
            }

            // Creating stuff
            var particles = new Array();
            var currentTime = +new Date();
    		var lastTime = currentTime;
    		var delta = currentTime - lastTime;

            for (var i = 0; i < options.particles; ++i) {

            	var size = 1;

            	if (Math.random() < 0.4) {
            		size = Math.random() * 2 + 1;
            	}
            	particles[i] = new Particle(0, 0, 255, 120, 50, size);
            	var behavior = new ParticleBehavior(particles[i]);
            	particles[i].behavior = behavior;
            	realignParticle(particles[i]);
            }

            var renderingLoop = function () {

	            lastTime = currentTime;
	            currentTime = +new Date();
	            delta = currentTime - lastTime;

	            context.clearRect(0, 0, canvas.width, canvas.height);

	            for (var i = 0; i < particles.length; ++i) {
	            	particles[i].update(delta);
	            	particles[i].draw(context);
	            }

	            QueueNewFrame();
            }

        	var QueueNewFrame = function () {

		        if (window.requestAnimationFrame)
		            window.requestAnimationFrame(renderingLoop);
		        else if (window.msRequestAnimationFrame)
		            window.msRequestAnimationFrame(renderingLoop);
		        else if (window.webkitRequestAnimationFrame)
		            window.webkitRequestAnimationFrame(renderingLoop);
		        else if (window.mozRequestAnimationFrame)
		            window.mozRequestAnimationFrame(renderingLoop);
		        else if (window.oRequestAnimationFrame)
		            window.oRequestAnimationFrame(renderingLoop);
		        else {
		            QueueNewFrame = function () {
		            };
		            intervalID = window.setInterval(renderingLoop, 16.7);
		        }
	    	};

         	renderingLoop();
 		}

 	});
  })(jQuery);
