import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Subdivision_Sphere, Textured_Phong} = defs;

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
            'watermelon': new Subdivision_Sphere(4),
            'watermelon_inside': new defs.Regular_2D_Polygon(30, 30),
            'orange': new Subdivision_Sphere(4),
            'orange_inside': new defs.Regular_2D_Polygon(30, 30),
            'peach': new Subdivision_Sphere(4),
            'peach_inside': new defs.Regular_2D_Polygon(30, 30),
            'apple': new Subdivision_Sphere(4),
            'apple_inside': new defs.Regular_2D_Polygon(30, 30),
            'mango': new Subdivision_Sphere(4),
            'mango_inside': new defs.Regular_2D_Polygon(30, 30),
            'bomb': new Subdivision_Sphere(4),
            'background': new Square(),
            'start_background': new Square(),
            'game_over_background': new Square()
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            watermelon_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/watermelon_texture.jpg", "NEAREST")
            }),
            half_watermelon_texture: new Material(new Hemi_Sphere(1.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/watermelon_texture.jpg", "NEAREST")
            }),
            watermelon_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/watermelon_inside.jpeg", "NEAREST")
            }),
            orange_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.1,
                texture: new Texture("assets/orange_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            half_orange_texture: new Material(new Hemi_Sphere(10.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.1,
                texture: new Texture("assets/orange_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            orange_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/orange_inside.jpeg", "LINEAR_MIPMAP_LINEAR")
            }),
            peach_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.1,
                texture: new Texture("assets/peach_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            half_peach_texture: new Material(new Hemi_Sphere(1.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.1,
                texture: new Texture("assets/peach_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            peach_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/peach_inside.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            apple_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 1.0,
                texture: new Texture("assets/apple_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            half_apple_texture: new Material(new Hemi_Sphere(1.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 1.0,
                texture: new Texture("assets/apple_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            apple_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/apple_inside.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            mango_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 1.0,
                texture: new Texture("assets/mango_skin.jpeg", "LINEAR_MIPMAP_LINEAR")
            }),
            half_mango_texture: new Material(new Hemi_Sphere(1.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 1.0,
                texture: new Texture("assets/mango_skin.jpeg", "LINEAR_MIPMAP_LINEAR")
            }),
            mango_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/mango_inside.jpeg", "LINEAR_MIPMAP_LINEAR")
            }),
            bomb_texture: new Material(new defs.Phong_Shader(),
                {ambient: 1, specularity: 1, color: hex_color("#000000")}),
            background_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.0,
                texture: new Texture("assets/cutting_board.jpg", "LINEAR_MIPMAP_LINEAR")}),
            start_background_texture: new Material(new Textured_Phong(),{
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.0,
                texture: new Texture("assets/start_menu.png", "LINEAR_MIPMAP_LINEAR")}),
           game_over_background_texture: new Material(new Textured_Phong(),{
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.0,
                texture: new Texture("assets/over.png", "LINEAR_MIPMAP_LINEAR")}),
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
        this.gameStarted = false;
        this.pause = true;
        this.score = 0;

        this.animation_active_queue = [];
        this.animation_inactive_queue = [];

        this.min_wave_timer = 2
        this.max_wave_timer = 4
        this.min_rest_timer = 2
        this.max_rest_timer = 5

        this.game_left_border = -23
        this.game_right_border = 23
        this.game_top_border = 23
        this.game_bottom_border = -3

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

        this.back_music = new Audio("assets/fnmusic.mp3");
        this.back_music.loop = false;
        this.back_music.volume = 0.1;



        this.bomb_sound = new Audio("assets/explosion.mp3");
        this.bomb_sound.volume = 0.1;

        this.knife_sound = new Audio("assets/knife-crop.mp3");
        this.knife_sound.volume = 0.1;




    }

    make_control_panel() {
        this.key_triggered_button("Start Game", ['Enter'], () =>{
            this.gameStarted = true;
            //this.pause = !this.pause;
            this.gameOver = false;
            this.back_music.play();
            this.back_music.loop = true;
        });
    }



    display_game_over(context, program_state){
        console.log("GAMEOVER")
        this.gameOver = true;
        let model_transform = Mat4.identity();
        let background_model_transform = Mat4.translation(0,10,-5).times(Mat4.scale(30,15,1))

        this.shapes.background.draw(context, program_state, background_model_transform, this.materials.game_over_background_texture)


    }

    my_mouse_down(e, pos, context, program_state){
       // console.log("Helper");

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

        let world_space_pos = pos_world_near
        world_space_pos[0] = world_space_pos[0]/0.74*this.game_right_border
        world_space_pos[1] = (world_space_pos[1] - 10)/((10.4 - 9.6)/2)*((this.game_top_border - this.game_bottom_border)/2) + 10
        //console.log("world_space_mouse_pos: " + world_space_pos)

        this.detect_cut_fruit(context, program_state, world_space_pos)

    }
    //ADDED

    detect_cut_fruit(context, program_state, position){
        if (this.animation_active_queue.length > 0) {
            for (let i = 0; i < this.animation_active_queue.length; i++) {
                let object = this.animation_active_queue[i];

                let objectSplit = false;
                //console.log("click")

                //get object's current center position using object.position
                //if mouse position is within object, split it
                if(object.type === "watermelon")
                {
                    console.log("DISTANCE WATERMELON: " + Math.sqrt((object.position[0] - position[0])**2 + (object.position[1] - position[1])**2))
                    if(Math.sqrt((object.position[0] - position[0])**2 + (object.position[1] - position[1])**2) <= 2.2){ //was 1 --> 1.9 -->
                        this.score++;
                        objectSplit = true;
                        this.knife_sound.play();
                        this.split_object(context, program_state, object)
                    }

                }
                else if(object.type === "mango")
                {
                    //console.log("DISTANCE MANGO: " + Math.sqrt((object.position[0] - position[0])**2 + (object.position[1] - position[1])**2))

                    if(Math.sqrt((object.position[0] - position[0])**2 + (object.position[1] - position[1])**2) <= 1.1){ //was 0.7 --> .99
                        this.score++;
                        objectSplit = true;
                        this.knife_sound.play();
                        this.split_object(context, program_state, object)
                    }

                }
                else if(object.type === "bomb"){
                    //console.log("DISTANCE BOMB: " + Math.sqrt((object.position[0] - position[0])**2 + (object.position[1] - position[1])**2))

                    if(Math.sqrt((object.position[0] - position[0])**2 + (object.position[1] - position[1])**2) <= 1.1){ //was 0.5-->/95
                        objectSplit = true;
                        this.bomb_sound.play();
                        this.display_game_over(context, program_state)

                    }
                }
                else
                {
                    //console.log("DISTANCE: OTHER " + Math.sqrt((object.position[0] - position[0])**2 + (object.position[1] - position[1])**2))

                    if(Math.sqrt((object.position[0] - position[0])**2 + (object.position[1] - position[1])**2) <= 1){ //was 0.5 --> .95
                        this.score++;
                        objectSplit = true;
                        this.knife_sound.play();
                        this.split_object(context, program_state, object);
                    }

                }

                if(objectSplit){
                    this.animation_active_queue.splice(i, 1)
                    i--
                }

                //maybe do ray casting here? you can use position[0] and position[1] to get
                //x,y of mouse click in world space

                //detect if ray collides with any object in animation_active_queue
                //you can check what kind of object has been collided with using object.type
                //"bomb" and "fruit"

                //all objects that are where mouse is when clicked should be split/explode if it is a bomb,
                //not just the first object


            }
        }
    }

    // generate_random_color() {
    //     return color(Math.random(), Math.random(), Math.random(), 1.0)
    // }

    generate_type_fruit() {
        let random = Math.random() * 10
        if(random < 8)
        {
            if(random < 1.6)
                return "apple"
            else if(random < 3.2)
                return "peach"
            else if(random < 4.8)
                return "watermelon"
            else if(random < 6.4)
                return "orange"
            else
                return "mango"
        }
        return "bomb"
    }
    rng_spawn(context, program_state, t){
        let currSecond = t/1000
        //levels of rng: wave timer, individual object spawn timer, spawn position,
        //hor vel (should be depending on spawn position), ver vel, type of object

        //spawn
        if(this.is_wave_spawning)
        {
            console.log("WAVE SPAWN")
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
            console.log("rest")
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
            console.log("CURRSECOND")
            while(this.spawn_number > 0)
            {
                let init_hor_pos = this.min_spawn_pos + Math.random() * (this.max_spawn_pos - this.min_spawn_pos)
                let peak_hor_pos = this.min_peak_hor_pos + Math.random() * (this.max_peak_hor_pos - this.min_peak_hor_pos)
                let peak_ver_pos = this.min_peak_ver_pos + Math.random() * (this.max_peak_ver_pos - this.min_peak_ver_pos)

                let init_ver_vel = Math.sqrt(2 * this.gravity * (peak_ver_pos - (-10)))
                let time_to_peak = init_ver_vel/(this.gravity)
                let init_hor_vel = (peak_hor_pos - init_hor_pos)/time_to_peak
                this.spawn_object(context, program_state, this.generate_type_fruit(), vec4(init_hor_pos, -10.0, 0.0, 1.0), init_hor_vel, init_ver_vel)
                this.spawn_number--;
            }
        }
        else if((this.indiv_spawn_timer - (currSecond - this.indiv_cycle_start)) < 0.1){
            console.log("OTHER SPAWN")
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
    spawn_object(context, program_state, type, from, init_hor_vel, init_ver_vel) {
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
            rot_angle: 0,
            start_time: program_state.animation_time,
            end_time: program_state.animation_time + 5000,
            type: type,
            gravity: this.gravity
        }

        this.animation_active_queue.push(object)
    }

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
            init_rot_angle: object.rot_angle[0],
            rot_dir: rot_random_dir * 1,
            start_time: program_state.animation_time,
            end_time: object.end_time,
            type: object.type,
            gravity: this.split_gravity
        }

        let split_object_2 = {
            from: object.position,
            //to: to,
            init_hor_vel: 4,
            init_ver_vel: -1 * ver_random_dir * object.ver_vel,
            init_rot_angle: object.rot_angle[0],
            rot_dir: rot_random_dir * -1,
            start_time: program_state.animation_time,
            end_time: object.end_time,
            type: object.type,
            gravity: this.split_gravity
        }

        this.animation_inactive_queue.push(split_object_1)
        this.animation_inactive_queue.push(split_object_2)
    }


    draw_fruit(context, program_state, translate, rotate, type){
        switch(type){
            case "apple":
                let apple_model_transform = Mat4.translation(translate[0], translate[1], translate[2])
                    .times(Mat4.rotation(rotate[0], rotate[1], rotate[2],rotate[3])).times(Mat4.scale(1, 1,1));
                this.shapes.apple.draw(context, program_state, apple_model_transform, this.materials.apple_texture)
                break;
            case "peach":
                let peach_model_transform = Mat4.translation(translate[0], translate[1], translate[2])
                    .times(Mat4.rotation(rotate[0], rotate[1], rotate[2],rotate[3])).times(Mat4.scale(1, 1,1));
                this.shapes.peach.draw(context, program_state, peach_model_transform, this.materials.peach_texture)
                break;
            case "watermelon":
                let watermelon_model_transform = Mat4.translation(translate[0], translate[1], translate[2])
                    .times(Mat4.rotation(rotate[0], rotate[1], rotate[2],rotate[3])).times(Mat4.scale(2, 2.5,2));
                this.shapes.watermelon.arrays.texture_coord.forEach(
                    (v, i, l) => {
                        v[0] = v[0] * 2
                    }
                )
                this.shapes.watermelon.draw(context, program_state, watermelon_model_transform, this.materials.watermelon_texture)
                break;
            case "orange":
                let orange_model_transform = Mat4.translation(translate[0], translate[1], translate[2])
                    .times(Mat4.rotation(rotate[0], rotate[1], rotate[2],rotate[3])).times(Mat4.scale(1, 1,1));
                this.shapes.orange.arrays.texture_coord.forEach(
                    (v, i, l) => {
                        v[0] = v[0] * 10
                        v[1] = v[1] * 10
                    }
                )
                this.shapes.orange.draw(context, program_state, orange_model_transform, this.materials.orange_texture)
                break;
            case "mango":
                let mango_model_transform = Mat4.translation(translate[0], translate[1], translate[2])
                    .times(Mat4.rotation(rotate[0], rotate[1], rotate[2],rotate[3])).times(Mat4.scale(1.5, 1.2,1.2));
                this.shapes.mango.draw(context, program_state, mango_model_transform, this.materials.mango_texture)
                break;
        }
    }

    draw_half_fruit(context, program_state, translate, rotate, type) {
        let outside_scale = vec4(0,0,0,0)
        let inside_scale = vec4(0,0,0,0)
        let outside_shape, outside_texture, inside_shape, inside_texture = 0
        switch(type){
            case "apple":
                outside_scale = vec4(1, 1, 1)
                inside_scale = vec4(1, 1, 1)
                outside_shape = this.shapes.apple
                outside_texture = this.materials.half_apple_texture
                inside_shape = this.shapes.apple_inside
                inside_texture = this.materials.apple_inside_texture
                break;
            case "peach":
                outside_scale = vec4(1, 1, 1)
                inside_scale = vec4(1, 1, 1)
                outside_shape = this.shapes.peach
                outside_texture = this.materials.half_peach_texture
                inside_shape = this.shapes.peach_inside
                inside_texture = this.materials.peach_inside_texture
                break;
            case "watermelon":
                this.shapes.watermelon.arrays.texture_coord.forEach(
                    (v, i, l) => {
                        v[0] = v[0] * 2
                    }
                )
                outside_scale = vec4(2, 2.5, 2)
                inside_scale = vec4(2, 2, 2)
                outside_shape = this.shapes.watermelon
                outside_texture = this.materials.half_watermelon_texture
                inside_shape = this.shapes.watermelon_inside
                inside_texture = this.materials.watermelon_inside_texture
                break;
            case "orange":
                this.shapes.orange.arrays.texture_coord.forEach(
                    (v, i, l) => {
                        v[0] = v[0] * 10
                        v[1] = v[1] * 10
                    }
                )
                outside_scale = vec4(1, 1, 1)
                inside_scale = vec4(1, 1, 1)
                outside_shape = this.shapes.orange
                outside_texture = this.materials.half_orange_texture
                inside_shape = this.shapes.orange_inside
                inside_texture = this.materials.orange_inside_texture
                break;
            case "mango":
                outside_scale = vec4(1.5, 1.2, 1.2)
                inside_scale = vec4(1.5, 1.2, 1)
                outside_shape = this.shapes.mango
                outside_texture = this.materials.half_mango_texture
                inside_shape = this.shapes.mango_inside
                inside_texture = this.materials.mango_inside_texture
                break;
        }

        let half_model_transform = Mat4.translation(translate[0], translate[1], translate[2])
            .times(Mat4.rotation(rotate[0], rotate[1], rotate[2],rotate[3])).times(Mat4.scale(outside_scale[0], outside_scale[1],outside_scale[2]));
        outside_shape.draw(context, program_state, half_model_transform, outside_texture);

        let inside_transform = Mat4.translation(translate[0], translate[1], translate[2])
            .times(Mat4.rotation(rotate[0], rotate[1], rotate[2],rotate[3]))
            .times(Mat4.rotation(Math.PI/2, 1, 0,0)).times(Mat4.scale(inside_scale[0], inside_scale[1],inside_scale[2]));
        inside_shape.draw(context, program_state, inside_transform, inside_texture)
    }

    displayUI() {

        let score = document.getElementById("score")
        score.innerHTML = this.score;

        // if(!this.gameStarted){
        //     let start = document.getElementById("start_menu")
        //     //start_menu.innerHTML = th
        // }
    }

    display(context, program_state) {
        super.display(context, program_state);
        const blue = hex_color("#1a9ffa");
        let model_transform = Mat4.identity();
        let t = program_state.animation_time;



        if(!this.gameStarted ){
            //draw background
            let background_model_transform = Mat4.translation(0,10,-5).times(Mat4.scale(30,15,1))

            this.shapes.background.draw(context, program_state, background_model_transform, this.materials.background_texture)
            //this.shapes.background.draw(context, program_state, background_model_transform, this.materials.game_over_background_texture)



        }
        else  if(this.gameOver){
            let background_model_transform = Mat4.translation(0,10,-5).times(Mat4.scale(15,15,1)) //x=30
            this.shapes.background.draw(context, program_state, background_model_transform, this.materials.game_over_background_texture);
            this.score = 0;
            ~this.back_music;
            this.back_music = new Audio("fnmusic.mp3");
            this.back_music.loop = false;
            this.back_music.volume = 0.05;
            //this.gameOver = !this.gameOver;
        }
        else{

            //draw background
            let background_model_transform = Mat4.translation(0,10,-5).times(Mat4.scale(30,15,1))

            this.shapes.background.draw(context, program_state, background_model_transform, this.materials.background_texture)

            this.rng_spawn(context, program_state, t);

            let canvas = context.canvas;

            const mouse_position = (e, rect = canvas.getBoundingClientRect()) =>
                vec((e.clientX - (rect.left + rect.right) / 2) / ((rect.right - rect.left) / 2),
                    (e.clientY - (rect.bottom + rect.top) / 2) / ((rect.top - rect.bottom) / 2));

            canvas.addEventListener("mousedown", e => {
                e.preventDefault();
                const rect = canvas.getBoundingClientRect()
                this.my_mouse_down(e, mouse_position(e, rect), context, program_state);

            });


            if (this.animation_active_queue.length > 0) {
                for (let i = 0; i < this.animation_active_queue.length; i++) {
                    let object = this.animation_active_queue[i];
                    //console.log("OBJECT: "+ object.type)

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
                        object.rot_angle = vec4(animation_process * 30, .3, .6, .2)

                        let random = Math.random() * 10

                        // if(object.type !== "bomb" && random > 9.5 && Math.abs(object.ver_vel) < 2)
                        // {
                        //     this.split_object(context, program_state, object)
                        //     this.animation_active_queue.splice(i, 1)
                        //     i--
                        // }
                        // else
                        // {
                        // let model_trans = Mat4.translation(position[0], position[1], position[2])
                        //     .times(Mat4.rotation(animation_process * 30, .3, .6, .2))

                        if(object.type !== "bomb") {
                            let angle = vec4(animation_process * 30, .3, .6, .2);
                            this.draw_fruit(context, program_state, position, angle, object.type);
                        }
                        else
                        {
                            let model_trans = Mat4.translation(position[0], position[1], position[2])
                                .times(Mat4.rotation(animation_process * 30, .3, .6, .2))
                            this.shapes.bomb.draw(context, program_state, model_trans, this.materials.bomb_texture);
                        }

                        //}
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

                        //console.log(split_object.init_rot_angle)
                        let angle = vec4(split_object.rot_dir * animation_process * 20 + split_object.init_rot_angle, .3, .6, .2);
                        this.draw_half_fruit(context, program_state, position, angle, split_object.type);
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
        }
        this.displayUI();
        }


}

class Hemi_Sphere extends Textured_Phong {
    constructor(scale) {
        super();
        this.scale = scale
    }
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #7.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord);
                
                // black out half of fruit
                float v = f_tex_coord.y/${this.scale + ".0"};
                if (v >= 0.5) {
                    tex_color = vec4(0, 0, 0, 0.0);
                }
                
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}