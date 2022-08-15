
const linearInterpolation = (A, B, p) => {
    /**
     * Imprecise method, which does not guarantee v = v1 when t = 1, 
     * due to floating-point arithmetic error.
     * This method is monotonic. This form may be used when the hardware has a native fused 
     * multiply-add instruction.
     * 
     * @param A 
     */
    return A + (B - A) * p
}

const preciseLinearInterpolation = (A, B, p) => {
    /**
     * Precise method, which guarantees v = v1 when t = 1. 
     * This method is monotonic only when v0 * v1 < 0.
     * Lerping between same values might not produce the same value
     * @param A 
     */
    return A * (1 - p) + B * p
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:linearInterpolation(A.x,B.x,t),
                y:linearInterpolation(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}

function getRandomColor(){
    const hue=290+Math.random()*260;
    return "hsl("+hue+", 100%, 60%)";
}

function getScreenShot() {
    let c = document.getElementById('canvas'); // or document.getElementById('canvas');
    html2canvas(c).then((canvas)=>{
      var t = canvas.toDataURL().replace("data:image/png;base64,", "");
      this.downloadBase64File('image/png',t,'image');
    })
  }

function downloadBase64File(contentType, base64Data, fileName) {
  const linkSource = `data:${contentType};base64,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}