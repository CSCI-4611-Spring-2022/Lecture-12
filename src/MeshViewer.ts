import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { GUI } from 'dat.gui'
import { GraphicsApp } from './GraphicsApp'

export class MeshViewer extends GraphicsApp
{ 
    // State variables
    private debugMode : boolean;
    private mouseDrag : boolean;

    // Camera parameters
    private cameraOrbitX : number;
    private cameraOrbitY : number;
    private cameraDistance : number;

    // Light parameters
    private lightOrbitX : number;
    private lightOrbitY : number;
    private lightIntensity : number;
    
    // Objects and materials
    private debugMaterial : THREE.MeshBasicMaterial;
    private light : THREE.DirectionalLight;
    private lightHelper : THREE.Line;

    private faceMesh : THREE.Mesh;
    private sadVertices : number[];
    private happyVertices : number[];
    private sadNormals : number[];
    private happyNormals : number[];
    private sadColor : THREE.Color;
    private happyColor : THREE.Color;
    private sadPosition : THREE.Vector3;
    private happyPosition : THREE.Vector3;
    private faceAlpha : number;
    private morphDirection : number;

    constructor()
    {
        // Pass in the aspect ratio to the constructor
        super(60, 1920/1080, 0.1, 10);

        this.debugMode = false;
        this.mouseDrag = false;

        this.cameraOrbitX = 0;
        this.cameraOrbitY = 0;
        this.cameraDistance = 0;

        this.lightOrbitX = 0;
        this.lightOrbitY = 0;
        this.lightIntensity = 0;

        this.debugMaterial = new THREE.MeshBasicMaterial();
        this.light = new THREE.DirectionalLight();
        this.lightHelper = new THREE.Line();

        this.faceMesh = new THREE.Mesh();
        this.sadVertices = [];
        this.happyVertices = [];
        this.sadNormals = [];
        this.happyNormals = [];
        this.sadColor = new THREE.Color('blue');
        this.happyColor = new THREE.Color('orange');
        this.sadPosition = new THREE.Vector3(0, 0, -1);
        this.happyPosition = new THREE.Vector3(0, 0, 0);
        this.faceAlpha = 0;
        this.morphDirection = 1;
    }

    createScene() : void
    {
        // Setup camera
        this.cameraDistance = 1;
        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 1, 0);

        // Create an ambient light
        var ambientLight = new THREE.AmbientLight('white', 0.15);
        this.scene.add(ambientLight);

        // Create a directional light
        this.light.color = new THREE.Color('white');
        this.lightIntensity = .75;
        this.lightOrbitX = -22.5;
        this.lightOrbitY = 45;
        this.scene.add(this.light)

        // Create a visual indicator for the light direction
        var lineVertices = [];
        lineVertices.push(new THREE.Vector3(0, 0, 0));
        lineVertices.push(new THREE.Vector3(0, 0, 10));
        this.lightHelper.geometry.setFromPoints(lineVertices);
        this.scene.add(this.lightHelper);

        // Assign the visual indicator color
        var lightHelperMaterial = new THREE.LineBasicMaterial();
        lightHelperMaterial.color = new THREE.Color('gray');
        this.lightHelper.material = lightHelperMaterial;

        // Update all the light visuals
        this.updateLightParameters();

        // Create the skybox material
        var skyboxMaterial = new THREE.MeshBasicMaterial();
        skyboxMaterial.side = THREE.BackSide;
        skyboxMaterial.color.set('black');

        // Create a skybox
        var skybox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), skyboxMaterial);
        this.scene.add(skybox);

        // Put the debug material into wireframe mode
        this.debugMaterial.wireframe = true;

        // Create a visual representation of the axes
        var axisHelper = new THREE.AxesHelper(2);
        this.scene.add(axisHelper);

        // Create the GUI
        var gui = new GUI();
        var controls = gui.addFolder('Controls');
        controls.open();

        var faceController = controls.add(this, 'faceAlpha', 0, 1);
        faceController.name('Face Alpha');
        faceController.onChange((value: number) => { this.morphFace()});

        // Create a GUI control for the light parameters
        var lightXController = controls.add(this, 'lightOrbitX', -180, 180);
        lightXController.name('Light Orbit X');
        lightXController.onChange((value: number) => { this.updateLightParameters()});

        var lightYController = controls.add(this, 'lightOrbitY', -90, 90);
        lightYController.name('Light Orbit Y');
        lightYController.onChange((value: number) => { this.updateLightParameters()});

        var lightYController = controls.add(this, 'lightIntensity', 0, 2);
        lightYController.name('Light Intensity');
        lightYController.onChange((value: number) => { this.updateLightParameters()});

        // Create a GUI control for the debug mode and add a change event handler
        var debugController = controls.add(this, 'debugMode');
        debugController.name('Debug Mode');
        debugController.onChange((value: boolean) => { this.toggleDebugMode(value) });

        this.loadFaces();
        this.faceMesh.material = new THREE.MeshLambertMaterial({color: this.sadColor});
        this.faceMesh.scale.set(0.035, 0.035, 0.035);
        this.faceMesh.position.copy(this.sadPosition);
        this.scene.add(this.faceMesh);
    }

    private loadFaces() : void
    {
        var loader = new PLYLoader();

        loader.load('./assets/sad.ply', (geometry : THREE.BufferGeometry) => {
            this.faceMesh.geometry = geometry;
            this.sadVertices = geometry.getAttribute('position').array as number[];
            this.sadNormals = geometry.getAttribute('normal').array as number[];
        });

        loader.load('./assets/happy.ply', (geometry : THREE.BufferGeometry) => {
            this.happyVertices = geometry.getAttribute('position').array as number[];
            this.happyNormals = geometry.getAttribute('normal').array as number[];
        });
    }

    private morphFace() : void
    {
        var blendedVertices = [];
        var blendedNormals = [];

        for(let i=0; i < this.sadVertices.length; i++)
        {
            blendedVertices.push(THREE.MathUtils.lerp(
                this.sadVertices[i], this.happyVertices[i], this.faceAlpha));
            
            blendedNormals.push(THREE.MathUtils.lerp(
                this.sadNormals[i], this.happyNormals[i], this.faceAlpha));
        }

        this.faceMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(blendedVertices, 3));
        this.faceMesh.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(blendedNormals, 3));

        var blendedColor = new THREE.Color();
        blendedColor.lerpColors(this.sadColor, this.happyColor, this.faceAlpha);
        (this.faceMesh.material as THREE.MeshLambertMaterial).color = blendedColor;

        var blendedPosition = new THREE.Vector3();
        blendedPosition.lerpVectors(this.sadPosition, this.happyPosition, this.faceAlpha);
        this.faceMesh.position.copy(blendedPosition);
    }

    update(deltaTime : number) : void
    {
        this.faceAlpha += 0.5 * deltaTime * this.morphDirection;
        if(this.faceAlpha > 1 || this.faceAlpha < 0)
        {
            this.faceAlpha = THREE.MathUtils.clamp(this.faceAlpha, 0, 1);
            this.morphDirection *= -1;
        }

        this.morphFace();
    }

    // Mouse event handlers for wizard functionality
    onMouseDown(event: MouseEvent) : void 
    {
        if((event.target! as Element).localName == "canvas")
        {
            this.mouseDrag = true;
        }
    }

    // Mouse event handlers for wizard functionality
    onMouseUp(event: MouseEvent) : void
    {
        this.mouseDrag = false;
    }
    
    onMouseMove(event: MouseEvent) : void
    {
        if(this.mouseDrag)
        {
            this.cameraOrbitX += event.movementY;

            if(this.cameraOrbitX < 90 || this.cameraOrbitX > 270)
                this.cameraOrbitY += event.movementX;
            else
                this.cameraOrbitY -= event.movementX;

            if(this.cameraOrbitX >= 360)
                this.cameraOrbitX -= 360;
            else if(this.cameraOrbitX < 0)
                this.cameraOrbitX += 360;

            if(this.cameraOrbitY >= 360)
                this.cameraOrbitY -= 360;
            else if(this.cameraOrbitY < 0)
                this.cameraOrbitY += 360;

            this.updateCameraOrbit();
        }
    }

    onMouseWheel(event: WheelEvent) : void
    {
        this.cameraDistance += event.deltaY / 1000;
        this.updateCameraOrbit();
    }

    private updateCameraOrbit() : void
    {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(-this.cameraOrbitY * Math.PI / 180);
        rotationMatrix.multiply(new THREE.Matrix4().makeRotationX(-this.cameraOrbitX * Math.PI / 180));

        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.applyMatrix4(rotationMatrix);

        if(this.cameraOrbitX < 90 || this.cameraOrbitX > 270)
            this.camera.up.set(0, 1, 0);
        else if(this.cameraOrbitX > 90 && this.cameraOrbitX < 270)
            this.camera.up.set(0, -1, 0);
        else if(this.cameraOrbitX == 270)
            this.camera.up.set(Math.sin(-this.cameraOrbitY * Math.PI / 180), 0, Math.cos(-this.cameraOrbitY * Math.PI / 180));
        else
            this.camera.up.set(-Math.sin(-this.cameraOrbitY * Math.PI / 180), 0, -Math.cos(-this.cameraOrbitY * Math.PI / 180));

        this.camera.lookAt(0, 0, 0);
    }

    private updateLightParameters() : void
    {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(this.lightOrbitX * Math.PI / 180);
        rotationMatrix.multiply(new THREE.Matrix4().makeRotationX(-this.lightOrbitY * Math.PI / 180));

        this.light.position.set(0, 0, 10);
        this.light.applyMatrix4(rotationMatrix);

        this.lightHelper.lookAt(this.light.position);

        this.light.intensity = this.lightIntensity;
    }

    private toggleDebugMode(debugMode: boolean) : void
    {
        if(debugMode)
        {
            this.faceMesh.userData = {'originalMaterial' : this.faceMesh.material}
            this.faceMesh.material = this.debugMaterial;
        }
        else
        {
            this.faceMesh.material = this.faceMesh.userData['originalMaterial'];
        }
    }
}
