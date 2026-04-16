export async function resizeImage(
    file: File,
    maxWidth: number = 200,
    maxHeight: number = 200,
    quality: number = 0.8,
): Promise<File> {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = (event)=>{
            const img = new Image();
            img.onload = ()=>{
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context){
                    reject(new Error("Failed to get canvas context"));
                    return;
                }

                let width = img.width;
                let height = img.height;

                if (width > height){
                    if(width > maxWidth){
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if(height > maxHeight){
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                context.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob)=>{
                        if(!blob){
                            reject(new Error("Failed to convert canvas to blob"));
                            return;
                        }
                        const resizedFile = new File([blob], file.name, {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        })
                        resolve(resizedFile);
                    },
                    "image/jpeg",
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error("Failed to load image"));
            };

            img.src = event.target?.result as string;
        };
        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };
        reader.readAsDataURL(file);
    })
}