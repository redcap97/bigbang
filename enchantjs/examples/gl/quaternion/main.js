enchant();
var game;
window.onload = function(){
    game = new Game(320, 320);
    game.fps = 60;
    game.onload = function(){
	    var scene = new Scene3D();
        scene.setDirectionalLight(new DirectionalLight());
        var camera = new Camera3D();
        scene.setCamera(camera);
        
        
        //�N�H�[�^�j�I���ɂ���]
        var labelA = new Label("Quaternion");
        labelA.x=50;
        labelA.y=220;
        labelA.color="#ffffff";
        game.rootScene.addChild(labelA);
        
	    var cubeA = new Cube();
	    cubeA.mesh.texture = new Texture("../../../images/enchant.png");
	    cubeA.mesh.texture.ambient = [0.2 ,0.2, 0.2, 1.0];
	    cubeA.x =-1;
	    cubeA.z =-12;
	    
    	//�ŏ��̎p�����Z�b�g
    	cubeA.rotationSet(new Quat(1,0,0,Math.PI));
    	
	    cubeA.addEventListener('touchstart', function(e){
	    	this.px=e.x;
	    	this.py=e.y;
	    });
	    cubeA.addEventListener('touchmove', function(e){
	    	var rotA = (e.x - this.px)*0.05;
	    	this.rotationApply(new Quat(0,1,0,rotA)); //���������ƂɃw�b�h��]
	    	var rotB = (e.y - this.py)*0.05;
	    	this.rotationApply(new Quat(1,0,0,rotB)); //���������ƂɃs�b�`��]
	    	this.px=e.x;
	    	this.py=e.y;
	    });
	    scene.addChild(cubeA);

	    //�I�C���[�p�ɂ���]
        var labelB = new Label("Euler Angles");
        labelB.x=210;
        labelB.y=220;
        labelB.color="#ffffff";
        game.rootScene.addChild(labelB);
        

	    cubeB = new Cube();
	    cubeB.mesh.texture = new Texture("../../../images/enchant.png");
	    cubeB.mesh.texture.ambient = [0.2 ,0.2, 0.2, 1.0];
	    cubeB.x = 1;
	    cubeB.z =-12;
    	cubeB.rotX = 0;
    	cubeB.rotY = 0;
    	
    	//�ŏ��̎p�����Z�b�g
	    cubeB.rotationSet(new Quat(1,0,0,Math.PI));
	    
	    cubeB.addEventListener('touchstart', function(e){
	    	this.px=e.x;
	    	this.py=e.y;
	    });
	    cubeB.addEventListener('touchmove', function(e){
	    	this.rotationSet(new Quat(1,0,0,Math.PI));//���Z�b�g���Ă���
	    	this.rotY += (e.x - this.px)*0.05;
	    	this.rotationApply(new Quat(0,1,0,this.rotY)); //Y���܂��ɉ�]
	    	this.rotX += (e.y - this.py)*0.05;
	    	this.rotationApply(new Quat(1,0,0,this.rotX));//X���܂��ɉ�]
	    	this.px=e.x;
	    	this.py=e.y;
	    });
	    scene.addChild(cubeB);


    };
    game.start();
};