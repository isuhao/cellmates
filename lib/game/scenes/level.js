ig.module('game.scenes.level').
requires(
'game.levels.hello', 'plugins.observable', 'impact.font'
).defines(function() {

	LevelScene = ig.Game.extend({
		gravity: 300,

		font: new ig.Font('media/04b03.font.png'),

		vel: {
			x: 10,
			y: 0
		},

		init: function() {
			ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.bind(ig.KEY.M, 'jump');

			ig.input.bind(ig.KEY.Q, 'heart-up');
			ig.input.bind(ig.KEY.A, 'heart-down');
			ig.input.bind(ig.KEY.W, 'heart-rate-up');
			ig.input.bind(ig.KEY.S, 'heart-rate-down');

			this.loadLevel(LevelHello);

			this.goal = this.getEntitiesByType(EntityGoalTrigger)[0];

			this.goal.on('player-made-it', this.onPlayerMadeIt.bind(this));

			this.player = this.getEntitiesByType(EntityPlayer)[0];
			this.heart = this.getEntitiesByType(EntityHeart)[0];

			var onRefillAcquired = this.onRefillAcquired.bind(this);
			this.getEntitiesByType(EntityRefill).forEach(function(refill) {
				refill.on('refill-acquired', onRefillAcquired);
			});
		},

		onRefillAcquired: function() {
			debugger;
			this.heart.cellCount  = (this.heart.cellCount + 10).limit(0, this.heart.maxCells);
		},

		onPlayerMadeIt: function() {
			this.madeIt = true;

			//var me = this;
			//setTimeout(function() {
				//me.fireEvent('scene-complete', 'TitleScene');
			//}, 2000);
		},

		update: function() {
			this.setCellsLastY();

			this.screen.x += this.vel.x * ig.system.tick;
			this.parent();

			this.checkForStandingOnCells();

			this.player.pos.x = Math.max(this.player.pos.x, this.screen.x);

			if (this.player.pos.y > this.height) {
				this.fireEvent('scene-complete', 'GameOverScene');
			}
		},

		getCells: function() {
			return this.getEntitiesByType(EntityCell);
		},

		setCellsLastY: function() {
			var cells = this.getCells();

			for(var i = 0; i < cells.length; ++i) {
				cells[i].lastY = cells[i].pos.y;
			}
		},

		checkForStandingOnCells: function() {
			var cells = this.getCells();

			for(var i = 0; i < cells.length; ++i) {
				var cell = cells[i];
				if(cell.lastY !== cell.pos.y) {
					cell.standingCount += ig.system.tick;
				} else {
					cell.standingCount = 0;
				}

				if(cell.standingCount >= cell.standingDuration) {
					cell.die();
				}
			}
		},


		draw: function() {
			this.parent();

			this.font.draw('Arrow Keys, X', 2, 2);

			if(this.madeIt) {
				this.font.draw('good job!', 50, 80);
			}
		},

		getMap: function(name) {
			return this.backgroundMaps.filter(function(m) {
				return m.name === name
			})[0];
		}
	});

	Object.defineProperty(LevelScene.prototype, 'height', {
		get: function() {
			var map = this.getMap('platforms');
			return (map && (map.height * this.collisionMap.tilesize)) || 0;
		}
	});
});

