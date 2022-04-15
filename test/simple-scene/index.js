/** @type module:entropy-engine */
ee ??= {};

const { Entity, Scene, rgb, v3, v2 } = ee;
const { run } = ee.EntropyEngine();

const main = Scene.create({
	settings: {
		backgroundTint: rgb(215),
		globalGravity: new v3(0, -1)
	}
});

main.entities.push(Entity.new({
	components: [
		new ee.Camera
	]
}));

function block (scale, position) {
	main.entities.push(Entity.new({
		components: [
			new ee.RectRenderer,
			new ee.RectCollider,
			new ee.Body
		],
		transform: new ee.Transform({ position, scale })
	}));
}

ee.scriptFromURL('test.es')
	.then(script => {
		main.entities.push(Entity.new({
			components: [
				new ee.CircleRenderer,
				new ee.CircleCollider,
				new ee.Body,
				script
			],
			transform: new ee.Transform({
				scale: new v3(50)
			})
		}));
	});


main.entities.push(Entity.new({
	components: [
		new ee.CircleRenderer({
			colour: rgb(0, 200, 200)
		})
	],
	transform: new ee.Transform({
		scale: new v3(5)
	})
}));

for (let i = 0; i < 10; i++) {
	block(
		new v3(Math.random() * 60 + 40, Math.random() * 60 + 40),
		new v3((Math.random()-0.5) * 500, (Math.random()-0.5) * 500)
	);
}


main.entities.push(Entity.new({
	Static: true,
	components: [
		new ee.RectRenderer,
		new ee.RectCollider,
		new ee.Body
	],
	transform: new ee.Transform({
		position: new v3(0, -300),
		scale: new v3(1000, 50)
	})
}));

main.entities.push(Entity.new({
	components: [
		new ee.GUIText({
			text: 'hello world',
			colour: rgb(0),
			fontSize: 50
		})
	]
}));


run();