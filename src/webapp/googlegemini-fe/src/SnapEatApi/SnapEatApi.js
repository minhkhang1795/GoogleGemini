import * as TestApi from "./TestApi";

const test = window.location.hostname === 'localhost'
const domain = test ? 'http://localhost:8000' : "https://snapeat.azurewebsites.net";

export const Recommend = test ? TestApi.testRecommend : recommend;

function recommend(formData) {
    return fetch(`${domain}/recommend/`, {
        method: 'POST',
        body: formData // Set the FormData object as the body of the request
    })
        .then(res => res.json())
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