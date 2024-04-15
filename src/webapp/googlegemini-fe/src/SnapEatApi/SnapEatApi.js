const domain = window.location.hostname === 'localhost' ? 'http://localhost:8000' : "https://snapeat.azurewebsites.net";


export const recommend = (formData) =>
    fetch(`${domain}/recommend/`, {
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
