ig.module('game.main').requires(
//'impact.debug.debug',
'impact.game', 'plugins.observable', 'game.scenes.title', 'game.scenes.level', 'game.scenes.game-over').defines(function() {
	MainGame = ig.Game.extend({
		font: new ig.Font('media/04b03.font.png'),

		init: function() {
			ig.input.bind(ig.KEY.P, 'pause');
			this._onSceneCompleteBound = this._onSceneComplete.bind(this);
			this._setScene(TitleScene);
		},

		update: function() {
			this.parent();
			if (ig.input.pressed('pause')) {
				ig.paused = ! ig.paused;
			}

			if (!ig.paused) {
				this._currentScene.update();
			}
		},

		draw: function() {
			this.parent();
			this._currentScene.draw();

			if (ig.paused) {
				ig.system.context.save();
				ig.system.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
				ig.system.context.fillRect(0, 0, ig.system.realWidth, ig.system.realHeight);
				ig.system.context.restore();
				this.font.draw('paused', ig.system.width / 2, ig.system.height / 2, ig.Font.ALIGN.CENTER);
			}
		},

		_setScene: function(SceneClass) {
			if (this._currentScene) {
				this._currentScene.un('scene-complete', this._onSceneCompleteBound);
			}

			var scene = new SceneClass(this._persistenceManager, this._session);
			scene.on('scene-complete', this._onSceneCompleteBound);

			this._currentScene = scene;
		},

		_onSceneComplete: function(nextSceneClassName) {
			this._setScene(window[nextSceneClassName]);
		}
	});

	function getUrlParam(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results == null) return "";
		else return results[1];
	}

	var scale = getUrlParam('scale');
	scale = scale ? parseFloat(scale) : 2;

	ig.main('#canvas', MainGame, 60, 320, 240, scale);
});
