const domain = window.location.hostname === 'localhost' ? 'http://localhost:8000' : "https://snapeat.azurewebsites.net";


export const recommend = (image, user_profile) =>
    fetch(`${domain}/recommend`)
        .then(res => res.json())
        .then(data => {
            if (data) {
                console.log(data);
                return data;
            }
            else {
                console.log("error");
                return null;
            }
        })
        .catch(rejected => {
            console.log(rejected);
        });
