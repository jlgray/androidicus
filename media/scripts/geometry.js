function angle_between3(vector_a, vector_b){
    //Returns the angle between vector_a and vector_b in radians
    //theta = arccos(a-hat dot b-hat)
    return Math.acos(dot_product3(scale_vector3(vector_a, 1.0), scale_vector3(vector_b, 1.0)));
}

function apply_rotation(rot_matrix, vectors){
    var rotated_vectors = [];
    //for each vector in vectors
    for (var i=0; i<vectors.length; i++){
        rotated_vectors[rotated_vectors.length] = [0,0,0];
        //for each element in vector
        for (var j=0; j<vectors[i].length; j++){
            for (var k=0; k<vectors[i].length; k++){
                rot_matrix_jk = (rot_matrix[j][k]*rot_matrix[j][k] > 0.00000001) ? rot_matrix[j][k] : 0;
                rotated_vectors[i][j] += vectors[i][k] * rot_matrix_jk;
            }
        }
        
    }
    return rotated_vectors;
}

function cross_product3(v1, v2){
    return [
        v1[1]*v2[2] - v1[2]*v2[1],
        -1.0*(v1[0]*v2[2] - v1[2]*v2[0]),
        v1[0]*v2[1] - v1[1]*v2[0],
    ];
    
};

function dot_product(vector_a, vector_b){
    //Returns the dot product of vector_a and vector_b
    
    var dot_product = 0.0;
    var i, looplen;
    for (i=0, len=vector_a.length; i<len; i++){
        dot_product += vector_a[i]*vector_b[i];
    }
    
    return dot_product
};

function dot_product3(vector_a, vector_b){
    //Returns the dot product of 3x1 vectors a and b.  Takes out overhead of for loop.
    
    var dot_product = 0.0;
    
    dot_product += vector_a[0]*vector_b[0];
    dot_product += vector_a[1]*vector_b[1];
    dot_product += vector_a[2]*vector_b[2];
    
    return dot_product
}

function get_rotation_matrix(v, theta){

	var d = Math.sqrt(v[2]*v[2] + v[1]*v[1])
	var sint = Math.sin(theta);
	var cost = Math.cos(theta);
	
	if (d==0){
		return [[1,     0,        0],
				  [0,   cost, -sint],
				  [0,   sint,  cost]]
	}
	var rz = [ [cost, -sint, 0],
				  [sint, cost, 0],
				  [0, 0, 1] ];
	
	var rxy  = [ [d,      -v[0]*v[1]/d,  -v[0]*v[2]/d],
				    [0,       v[2]/d,         -v[1]/d],
				    [v[0],    v[1],            v[2]] ];
					
	var rxy_inv = [ [d,                   0,        v[0]],
					   [ -v[0]*v[1]/d,   v[2]/d,      v[1]],
					   [ -v[0]*v[2]/d,  -v[1]/d,      v[2]] ];
					   
	
				  
	return multiply_matrices( rxy_inv, multiply_matrices(rz, rxy) );
	
}



function multiply_matrices(matrixA, matrixB){
    /*
      A is a m x n matrix of m row vectors of length n, and 
      B is a n x v matrix of v column vectors of length n
      
      In practical terms this means that the input of this function should look like:
      ([[a11,...,a1n],...,[am1,...,amn]], [[b11,...,bn1],...,[b1v,...,bnv]])
      
      I chose this convention to facilitate multiplying a set of vectors (B) 
      by a transform matrix (A)
    */
	var c = [];
	for (var i=0; i<matrixA.length; i++){
		c[c.length] = [];
		for (var j=0; j<matrixB[0].length; j++){
			var cij = 0;
			for (var k=0; k<matrixA[i].length; k++){
				cij+=matrixA[i][k]*matrixB[k][j];
			}
			c[i][j] = cij;
		}
	}
	return c;
}

function apply_matrix(matrixA, matrixB){
    /*
      A is a m x n matrix of m row vectors of length n, and 
      B is a n x v matrix of v column vectors of length n
      
      In practical terms this means that the input of this function should look like:
      ([[a11,...,a1n],...,[am1,...,amn]], [[b11,...,bn1],...,[b1v,...,bnv]])
      
      I chose this convention to facilitate multiplying a set of vectors (B) 
      by a transform matrix (A)
    */
    var return_matrix = [];
    //for each vector in in matrixB
    for (var i=0; i<matrixB.length; i++){
        return_matrix[i] = []
        //for each vector in matrixA
        for (var j=0; j<matrixA[i].length; j++){
            return_matrix[i][j] = dot_product(matrixA[j], matrixB[i]);
            }
    }
    return return_matrix;
}

function transpose(mat){
	var matT = [];
    for (var i=0; i<mat[0].length; i++){
		matT[i] = [];
		for (var j=0; j<mat.length; j++){
			matT[i][j] = mat[j][i]
		}
	}
	return matT;
}



function scale_vector3(vector, magnitude){
    //returns a vector with the same direction, but with a specified magnitude
    var scale_factor = magnitude/Math.sqrt(dot_product3(vector, vector));
    return [scale_factor*vector[0],
            scale_factor*vector[1],
            scale_factor*vector[2]];
    
}