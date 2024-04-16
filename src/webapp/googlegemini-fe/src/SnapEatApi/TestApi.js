import recommendSample from "./recommend-sample.json"


export const testRecommend = (formData) => {
    return fetch(`./recommend-sample.json`)
        .then(res => recommendSample)
        .then(data => {
            if (data) {
                console.log(data);
                return data;
            } else {
                console.log("error");
                return null;
            }
        });
}