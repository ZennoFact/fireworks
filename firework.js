class FireWork {

    constructor(geometry, texture) {
        this.size = 10;
        this.color = this.getColor();
        this.upRatio = 0.3;
        this.maxVelocity = 5.0; // 最大速度
		this.particleVelocity = [];
		this.particlePositions = new Float32Array(this.size * this.size * 3);
        this.maxLifeTime = Math.random() * 250 + 100;
        this.lifeTime = this.maxLifeTime;
        this.particleSize = 150;
        this.geometry = geometry;
        this.isExploded = false;
        
        // TODO: BufferGeometryにした方が速度上がる？
        // this.geometry = new THREE.BufferGeometry();
		// this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( particlePositions, 3 ).setUsage(THREE.DynamicDrawUsage));

        for ( let i = 0; i < this.size * this.size; i ++ ) {
			//速度（x、y、z）を設定 中心からの座標のずれをそのまま速度にしている
			this.particleVelocity[i] = new THREE.Vector3();
            this.particleVelocity[i].x = this.geometry.attributes.position.getX(i);
			this.particleVelocity[i].y = this.geometry.attributes.position.getY(i);
			this.particleVelocity[i].z = this.geometry.attributes.position.getZ(i);
		
			//速度の調整　TODO: 調整が必要
			this.particleVelocity[i].multiplyScalar(this.maxVelocity / Math.sqrt(3.0));

		}

        this.material = new THREE.PointsMaterial( {
            blending: THREE.AdditiveBlending,
            color: this.color,
            depthTest: false,
            opacity: 1.0,
            map: texture,
            size: this.particleSize,
            transparent: true
        },
        undefined, // onProgress callback currently not supported
        function ( err ) { // onError callback
            console.error( 'An error happened.' );
        } );

        
        
        this.pointCloud = new THREE.Points( this.geometry, this.material );
        // ランダムに位置を調整
        const posRange = 3000;
        this.x = Math.random() * posRange - posRange / 2;
        this.z = Math.random() * posRange - posRange / 2;
        this.pointCloud.position.set(this.x, 0, this.z);
        this.pointCloud.material.depthWrite = false;
    }

    move() {
        this.lifeTime--;

        //頂点座標を取得
        const particlePositions = this.pointCloud.geometry.attributes.position.array;
        
        if (this.isExploded) {
            for(let i = 0; i < this.size * this.size; i++){
                //頂点座標に速度を加算
                particlePositions[i*3] += this.particleVelocity[i].x;
                particlePositions[i*3+1] += this.particleVelocity[i].y;
                particlePositions[i*3+2] += this.particleVelocity[i].z;
    
                this.particleVelocity[i].x * 0.9;
                this.particleVelocity[i].y * 0.9;
                this.particleVelocity[i].z * 0.9;
            } 
    
            this.lifeTime--;
            this.pointCloud.material.opacity -= 0.01
            // PointCloudの更新を通知するフラグ
            this.pointCloud.geometry.attributes.position.needsUpdate = true;
        } else {
            for(let i = 0; i < this.size * this.size; i++){
                // 打ち上げ
                this.pointCloud.position.y += 0.1;
            }
        }

    
		return false; 
    }

    hadReachTheTop() {
        if (this.lifeTime < this.maxLifeTime * this.upRatio && !this.isExploded) {
            return true;
        }  
        return false;
    }
    
    explode() {
        this.isExploded = true;
        // 爆発して散っていく角度をランダムに指定
        const x = Math.random() * 90 - 45;
        const y = Math.random() * 90 - 45;
        const z = Math.random() * 90 - 45;
        this.pointCloud.rotation.set(x, y, z );
        this.material.depthWrite = false;
    }
    
    dispose(scene) {
        scene.remove(this.pointCloud);
        this.pointCloud.material.dispose();
        this.geometry.dispose();
    }

    getColor() {
        let color = "#";
        const r = this.getRandomColorHex();
        const g = this.getRandomColorHex();
        const b = this.getRandomColorHex();
        color += r + g + b;
        
        return color;
    }

    getRandomColorHex() {
        const base = 156;
        const adjust = 10;
        return (parseInt(Math.random() * base) + adjust).toString(16).padStart(2, '0');
    }
}

class RemoteFireWork extends FireWork {
    hadReachTheTop() {
        if (this.lifeTime < this.maxLifeTime * this.upRatio && !this.isExploded) {
            // 爆発する前に，角度のランダム性を持たせたい
            this.lifeTime++;
            for(let i = 0; i < this.size * this.size; i++){
                // 打ち上げの移動を戻す
                this.pointCloud.position.y -= 0.1;  
            }
        }
		return false;
    }

    explode() {
        super.explode();
        this.lifeTime = this.maxLifeTime * this.upRatio - 1;
    }
}