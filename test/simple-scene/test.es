using(import('ee'));

func Start (self) {
	print('starting');
};

func Update (self) {
	self.transform.position.set(input.cursorPosWorldSpace);
};