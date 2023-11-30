import {defs, tiny} from './examples/common.js';
//import {Text_Line} from './examples/text-demo.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Subdivision_Sphere} = defs;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);


        let bbox_dims = vec3(2, 2, 2);
        this.aabb_min = vec4(-bbox_dims[0] / 2, -bbox_dims[1] / 2, -bbox_dims[2] / 2, 1);
        this.aabb_max = vec4(bbox_dims[0] / 2, bbox_dims[1] / 2, bbox_dims[2] / 2, 1);
        this.model_transform = Mat4.identity();

        this.has_been_clicked = false;
    }
}

class Box extends Shape {
    constructor() {
        super("position", "color");
        //  TODO (Requirement 5).
        // When a set of lines is used in graphics, you should think of the list entries as
        // broken down into pairs; each pair of vertices will be drawn as a line segment.
        // Note: since the outline is rendered with Basic_shader, you need to redefine the position and color of each vertex
        this.indices = false
        this.arrays.position = Vector3.cast(
            [1,-1,-1], [-1, -1,-1],
                [1, 1, -1], [-1, 1, -1],
            [-1, 1, -1], [-1, -1, -1],
            [1, 1, -1], [1, -1, -1]
            );
        this.arrays.color = [
            vec4(1,1,1,1), vec4(1,1,1,1),
            vec4(1,1,1,1), vec4(1,1,1,1),
            vec4(1,1,1,1), vec4(1,1,1,1),
            vec4(1,1,1,1), vec4(1,1,1,1),
        ];
    }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("position", "normal");
        // TODO (Requirement 6)
        this.arrays.position = Vector3.cast(
            [-1,1,1],[-1,1,-1],[1,1,-1],[1,1,1],
            [-1,-1,1],[-1,-1,-1],[1,-1,-1],[1,-1,1]
        );
        this.arrays.normal = Vector3.cast(
            [-1,1,1],[-1,1,-1],[1,1,-1],[1,1,1],
            [-1,-1,1],[-1,-1,-1],[1,-1,-1],[1,-1,1]
        );
        this.indices.push(1,2,0,3,7,2,6,1,5,0,4,7,5,6)
    }
}


class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'border': new Box(),
            'cube_strip': new Cube_Single_Strip(),
            'bomb': new Subdivision_Sphere(4)
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
    }
    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Fruit_Gravity extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */
    constructor(){
        super();
        this.animation_active_queue = [];
        this.animation_inactive_queue = [];

        this.min_wave_timer = 2
        this.max_wave_timer = 4
        this.min_rest_timer = 2
        this.max_rest_timer = 5

        this.min_spawn_number = 1
        this.max_spawn_number = 4
        this.min_indiv_spawn_timer = 0.5
        this.max_indiv_spawn_timer = 1.5

        this.min_spawn_pos = -22
        this.max_spawn_pos = 22
        this.min_peak_hor_pos = -10
        this.max_peak_hor_pos = 10
        this.min_peak_ver_pos = 8
        this.max_peak_ver_pos = 16

        this.gravity = 25
        this.split_gravity = 35

        this.wave_timer = 6
        this.rest_timer = 2
        this.cycle_start = 0
        this.indiv_cycle_start = 0
        this.is_wave_spawning = true
        this.spawn_number = 1
        this.indiv_spawn_timer = 1

        //mouse controls
        this.mouse = {"from_center": vec(0, 0)};
        //score
        this.score = 0;

    }

    generate_random_color() {
        return color(Math.random(), Math.random(), Math.random(), 1.0)
    }

    generate_type_fruit() {
        let random = Math.random() * 10
        if(random < 8)
            return "fruit"
        return "bomb"
    }
    rng_spawn(context, program_state, t){
        let currSecond = t/1000
        //levels of rng: wave timer, individual object spawn timer, spawn position,
        //hor vel (should be depending on spawn position), ver vel, type of object

        //spawn
        if(this.is_wave_spawning)
        {
            if((currSecond - this.cycle_start) >= 0 && (currSecond - this.cycle_start) < this.wave_timer) {
                this.spawn_wave(context, program_state, t);
            }
            else{
                this.is_wave_spawning = false
            }
        }
        //rest
        else
        {
            if((currSecond - this.cycle_start) > (this.wave_timer + this.rest_timer)){
                this.is_wave_spawning = true
                this.cycle_start = currSecond
                this.wave_timer = this.min_wave_timer + Math.random() * (this.max_wave_timer - this.min_wave_timer)
                this.rest_timer = this.min_rest_timer + Math.random() * (this.max_rest_timer - this.min_rest_timer)
            }
        }

    }
    spawn_wave(context, program_state, t){
        let currSecond = t/1000

        if((currSecond - this.indiv_cycle_start) < 0.1) {
            while(this.spawn_number > 0)
            {
                let init_hor_pos = this.min_spawn_pos + Math.random() * (this.max_spawn_pos - this.min_spawn_pos)
                let peak_hor_pos = this.min_peak_hor_pos + Math.random() * (this.max_peak_hor_pos - this.min_peak_hor_pos)
                let peak_ver_pos = this.min_peak_ver_pos + Math.random() * (this.max_peak_ver_pos - this.min_peak_ver_pos)

                let init_ver_vel = Math.sqrt(2 * this.gravity * (peak_ver_pos - (-10)))
                let time_to_peak = init_ver_vel/(this.gravity)
                let init_hor_vel = (peak_hor_pos - init_hor_pos)/time_to_peak
                this.spawn_object(context, program_state, this.generate_type_fruit(), vec4(init_hor_pos, -10.0, 0.0, 1.0), init_hor_vel, init_ver_vel, this.generate_random_color())
                this.spawn_number--;
            }
        }
        else if((this.indiv_spawn_timer - (currSecond - this.indiv_cycle_start)) < 0.1){
            let spawn_roll =  Math.random() * 10
            if(spawn_roll < 7.5)
                this.spawn_number = 1
            else if(spawn_roll < 8.5)
                this.spawn_number = 2
            else if(spawn_roll < 9.5)
                this.spawn_number = 3
            else
                this.spawn_number = 4
            this.indiv_cycle_start = currSecond
            this.indiv_spawn_timer = this.min_indiv_spawn_timer + Math.random() * (this.max_indiv_spawn_timer - this.min_indiv_spawn_timer)
        }

    }
    spawn_object(context, program_state, type, from, init_hor_vel, init_ver_vel, color) {
        // let pos_ndc_near = vec4(1.0, pos[1], -1.0, 1.0);
        // //let pos_ndc_far  = vec4(pos[0], pos[1],  1.0, 1.0);
        // let pos_ndc_far  = vec4(1.0, 0.5, 1.0, 1.0);
        // console.log(pos_ndc_far)
        // //let center_ndc_near = vec4(0.0, 0.0, -1.0, 1.0);
        // let center_ndc_near = vec4(-1.0, 0.5, 1.0, 1.0);
        // let P = program_state.projection_transform;
        // let V = program_state.camera_inverse;
        // let pos_world_near = Mat4.inverse(P.times(V)).times(pos_ndc_near);
        // let pos_world_far  = Mat4.inverse(P.times(V)).times(pos_ndc_far);
        // let center_world_near  = Mat4.inverse(P.times(V)).times(center_ndc_near);
        // pos_world_near.scale_by(1 / pos_world_near[3]);
        // pos_world_far.scale_by(1 / pos_world_far[3]);
        // center_world_near.scale_by(1 / center_world_near[3]);
        // console.log(pos_world_far);

        //Do whatever you want
        let object = {
            from: from,
            position: from,
            //to: to,
            init_hor_vel: init_hor_vel,
            init_ver_vel: init_ver_vel,
            hor_vel: init_hor_vel,
            ver_vel: init_ver_vel,
            start_time: program_state.animation_time,
            end_time: program_state.animation_time + 5000,
            type: type,
            color: color,
            gravity: this.gravity
        }

        this.animation_active_queue.push(object)
    }



    my_mouse_down(e, pos, context, program_state){
        console.log("Helper reached");



        // The ray is drawn from the near point to far point
        let pos_ndc_near = vec4(pos[0], pos[1], -1.0, 1.0); // normalized device coords of mouse on near plane
        let pos_ndc_far  = vec4(pos[0], pos[1],  1.0, 1.0); // normalized device coords of mouse on far plane
        let center_ndc_near = vec4(0.0, 0.0, -1.0, 1.0); // normalized device coords of center of near plane
        let P = program_state.projection_transform; // eye space -> projection space
        let V = program_state.camera_inverse; // world space -> eye space

        // (PV)^-1 = (V^-1)(P^-1) which goes from projection space -> world space
        let pos_world_near = Mat4.inverse(P.times(V)).times(pos_ndc_near); // world space coords of mouse near plane
        let pos_world_far  = Mat4.inverse(P.times(V)).times(pos_ndc_far); // world space coords of mouse far plane
        let center_world_near  = Mat4.inverse(P.times(V)).times(center_ndc_near); // world space coords of center of near plane

        // Perspective division
        pos_world_near.scale_by(1 / pos_world_near[3]);
        pos_world_far.scale_by(1 / pos_world_far[3]);
        center_world_near.scale_by(1 / center_world_near[3]);

        // Get ray
        const ray_direction = pos_world_far.minus(pos_world_near).normalized();

        // Check if the ray intersects with oriented bounding box of each fruit
        // I'm using the method described here:
        // http://www.opengl-tutorial.org/miscellaneous/clicking-on-objects/picking-with-custom-ray-obb-function/
        let nearest_intersecting_cube = null;
        let nearest_intersecting_distance = Infinity;
        let cube = this.shapes.cube;

        let tMin = 0;
        let tMax = Infinity;
        let intersection = true;


        // console.log(cube.model_transform); // Log the entire model_transform
        // console.log(cube.model_transform[0]); // Log the first row of the matrix
        // console.log(cube.model_transform[1]); // Log the second row of the matrix
        // console.log(cube.model_transform[2]); // Log the third row of the matrix



        const obb_position_worldspace = vec3(cube.model_transform[0][3], cube.model_transform[1][3], cube.model_transform[2][3]);
            const delta = obb_position_worldspace.minus(pos_world_near.to3());
            for (let i = 0; i < 3; i++) {
                const axis = vec3(cube.model_transform[0][i], cube.model_transform[1][i], cube.model_transform[2][i]); // columns or rows?
                const e = axis.dot(delta);
                const f = axis.dot(ray_direction.to3());
                let t1 = (e + cube.aabb_min[i]) / f;
                let t2 = (e + cube.aabb_max[i]) / f;
                if (t1 > t2) {
                    let temp = t1;
                    t1 = t2;
                    t2 = temp;
                }
                if (t2 < tMax) {
                    tMax = t2;
                }
                if (t1 > tMin) {
                    tMin = t1;
                }
            }
            if (tMax < tMin) {
                intersection = false;
            }
            if (intersection && tMin < nearest_intersecting_distance) {
                nearest_intersecting_cube = cube;
                nearest_intersecting_distance = tMin;
            }

        if (nearest_intersecting_cube !== null && !nearest_intersecting_cube.has_been_clicked) {
            //const z_distance = Math.abs(this.user_position[2] - nearest_intersecting_cube.position[2]);
            if (nearest_intersecting_cube.shape === this.shapes.bomb) {
                console.log("BOMB DETECTED");
            }
            else{ // normal punch mechanics
                console.log("FRUIT TOUCHED");
               // nearest_intersecting_cube.split_object(context, program_state,nearest_intersecting_cube); //FIX
                //this.score++;
            }
        }
    }
    //ADDED





    split_object(context, program_state, object){
        let ver_random_dir = Math.floor(Math.random()*2)
        if(ver_random_dir === 0)
            ver_random_dir = -1
        else
            ver_random_dir = 1

        let rot_random_dir = Math.floor(Math.random()*2)
        if(rot_random_dir === 0)
            rot_random_dir = -1
        else
            rot_random_dir = 1

        let split_object_1 = {
            from: object.position,
            //to: to,
            init_hor_vel: -4,
            init_ver_vel: ver_random_dir * object.ver_vel,
            rot_dir: rot_random_dir * 1,
            start_time: program_state.animation_time,
            end_time: object.end_time,
            type: object.type,
            color: object.color,
            gravity: this.split_gravity
        }

        let split_object_2 = {
            from: object.position,
            //to: to,
            init_hor_vel: 4,
            init_ver_vel: -1 * ver_random_dir * object.ver_vel,
            rot_dir: rot_random_dir * -1,
            start_time: program_state.animation_time,
            end_time: object.end_time,
            type: object.type,
            color: object.color,
            gravity: this.split_gravity
        }

        this.animation_inactive_queue.push(split_object_1)
        this.animation_inactive_queue.push(split_object_2)
    }


    displayUI() {

        let score = document.getElementById("score")
        score.innerHTML = this.score;
    }

    display(context, program_state) {
        super.display(context, program_state);
        const blue = hex_color("#1a9ffa");
        let model_transform = Mat4.identity();
        let t = program_state.animation_time;



        this.rng_spawn(context, program_state, t);

        let canvas = context.canvas;

        //console.log("Mouse down event triggered");
        const mouse_position = (e, rect = canvas.getBoundingClientRect()) =>
            vec((e.clientX - (rect.left + rect.right) / 2) / ((rect.right - rect.left) / 2),
                (e.clientY - (rect.bottom + rect.top) / 2) / ((rect.top - rect.bottom) / 2));

        canvas.addEventListener("mousedown", e => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect()
            // console.log("e.clientX: " + e.clientX);
            // console.log("e.clientX - rect.left: " + (e.clientX - rect.left));
            // console.log("e.clientY: " + e.clientY);
            // console.log("e.clientY - rect.top: " + (e.clientY - rect.top));
            // console.log("mouse_position(e): " + mouse_position(e));
            // this.my_mouse_down(e, mouse_position(e), context, program_state);


            //const mouse_pos = mouse_position(e, rect);
            //this.my_mouse_down(e, mouse_pos, context, program_state);

            this.my_mouse_down(e, mouse_position(e, rect), context, program_state);

        });



        if (this.animation_active_queue.length > 0) {
            for (let i = 0; i < this.animation_active_queue.length; i++) {
                let object = this.animation_active_queue[i];

                let from = object.from;

                let start_time = object.start_time;
                let end_time = object.end_time;

                    if (t <= end_time && t >= start_time) {
                    let animation_process = (t - start_time) / (end_time - start_time);
                    let position = vec4(0,0,0,1.0)

                    position[0] = from[0] + object.init_hor_vel * (t - start_time) / 1000
                    position[1] = from[1] + object.init_ver_vel * (t - start_time) / 1000 -
                        0.5 * object.gravity * ((t - start_time) / 1000) ** 2;

                    object.position = position
                    object.ver_vel = object.init_ver_vel - object.gravity * (t - start_time) / 1000

                    let random = Math.random() * 10
                    //console.log(random)
                    if(object.type === "fruit" && random > 9.5 && Math.abs(object.ver_vel) < 2)
                    {
                        this.split_object(context, program_state, object)
                        this.animation_active_queue.splice(i, 1)
                        i--
                    }
                    else
                    {
                        let model_trans = Mat4.translation(position[0], position[1], position[2])
                            .times(Mat4.rotation(animation_process * 30, .3, .6, .2))

                        if(object.type === "fruit")
                            this.shapes.cube.draw(context, program_state, model_trans, this.materials.plastic.override({color:object.color}));
                        else
                            this.shapes.bomb.draw(context, program_state, model_trans, this.materials.plastic.override({color:object.color}));
                    }
                }
            }
        }
        if (this.animation_inactive_queue.length > 0) {
            for (let i = 0; i < this.animation_inactive_queue.length; i++) {
                let split_object = this.animation_inactive_queue[i];

                let from = split_object.from;

                let start_time = split_object.start_time;
                let end_time = split_object.end_time;

                if (t <= end_time && t >= start_time) {
                    let animation_process = (t - start_time) / (end_time - start_time);
                    let position = vec4(0,0,0,1.0)

                    position[0] = from[0] + split_object.init_hor_vel * (t - start_time) / 1000
                    position[1] = from[1] + split_object.init_ver_vel * (t - start_time) / 1000 -
                        0.5 * split_object.gravity * ((t - start_time) / 1000) ** 2;


                    let model_trans = Mat4.translation(position[0], position[1], position[2])
                        .times(Mat4.rotation(split_object.rot_dir * animation_process * 20, .3, .6, .2)).times(Mat4.scale(0.5, 1, 1))

                    this.shapes.cube.draw(context, program_state, model_trans, this.materials.plastic.override({color:split_object.color}));
                }
            }
        }
        // remove finished animation
        while (this.animation_active_queue.length > 0 || this.animation_inactive_queue.length > 0) {
            if ((this.animation_active_queue.length > 0 && t > this.animation_active_queue[0].end_time) ||
                (this.animation_inactive_queue.length > 0 && t > this.animation_inactive_queue[0].end_time)) {
                if(this.animation_active_queue.length > 0 && t > this.animation_active_queue[0].end_time)
                    this.animation_active_queue.shift();
                if(this.animation_inactive_queue.length > 0 && t > this.animation_inactive_queue[0].end_time)
                    this.animation_inactive_queue.shift();
            }
            else {
                break;
            }
        }

        let border_trans = Mat4.identity()
        border_trans = border_trans.times(Mat4.translation(0, (this.max_peak_ver_pos + this.min_peak_ver_pos)/2, 0)).times(Mat4.scale((this.max_peak_hor_pos - this.min_peak_hor_pos)/2, (this.max_peak_ver_pos - this.min_peak_ver_pos)/2, 1))
        this.shapes.border.draw(context, program_state, border_trans, this.white, "LINES");


        this.displayUI();
        // displaying score
        // let score_pos = Mat4.identity().times(Mat4.translation(-18, 20, 3)).times(Mat4.scale(0.3, 0.3, 0.3));
        // let score_string = "Score: " + this.score;
        // this.shapes.text.set_string(score_string, context.context);
        // this.shapes.text.draw(context, program_state, score_pos, this.text_image);
    }
}