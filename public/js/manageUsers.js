const rankSelects = document.querySelectorAll('.rankSelect');
rankSelects.forEach(select => {
    select.addEventListener('change', () => {
        select.parentElement.submit();
    })
})


const userSearch = document.getElementById('userSearch');
const resultBox = document.getElementById('searchResultBox');


userSearch.addEventListener('input', async () => {
    const search = userSearch.value.trim();
    console.log(search)
    resultBox.innerHTML = '';
    if (search !== '') {
        response = await axios.get(`/user/manage/search?search=${search}`)
        const users = response.data
        for (let user of users) {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'bg-light');
            

                if (currentUserAdmin === 'false') {
                    li.innerHTML = `
                    <div class="row">
                        <div class="col-3 col-sm- my-auto" id="userName-${user._id}">
                            ${user.firstName} ${user.lastName}
                        </div>
                        <div class="col-3 col-sm- my-auto" id="userEmail-${user._id}">
                            ${user.email}
                        </div>
                        <div class="col-3 col-sm- text-start my-auto" id="userRank-${user._id}">
                            ${user.admin ? 'Admin' : 'Member'}
                        </div>
                        <div class="col-3 col-sm- text-end my-auto">
                            
                        </div>
                    </div>`
                    
                }

                else if (user.requestedPlants.includes(currentPlantID)) {
                    li.innerHTML = `
                    <div class="row">
                        <div class="col-3 col-sm- my-auto" id="userName-${user._id}">
                            ${user.firstName} ${user.lastName}
                        </div>
                        <div class="col-3 col-sm- my-auto" id="userEmail-${user._id}">
                            ${user.email}
                        </div>
                        <div class="col-3 col-sm- text-start my-auto" id="userRank-${user._id}">
                            ${user.admin ? 'Admin' : 'Member'}
                        </div>
                        <div class="col-3 col-sm- text-end my-auto">
                            <form class="d-inline" action="/user/${user._id}/manage/${currentPlantID}?_method=DELETE&status=requested" method="post">
                                <button class="btn btn-danger">Deny</button>
                            </form>
                            <form class="d-inline" action="/user/${user._id}/manage/${currentPlantID}?_method=PUT&status=requested" method="post">
                                <button class="btn btn-success">Approve</button>
                            </form>
                        </div>
                    </div>`
                } else if (user.plants.includes(currentPlantID)) {
                    li.innerHTML = `
                    <div class="row">
                        <div class="col-3 col-sm- my-auto" id="userName-${user._id}">
                            ${user.firstName} ${user.lastName}
                        </div>
                        <div class="col-3 col-sm- my-auto" id="userEmail-${user._id}">
                            ${user.email}
                        </div>
                        <div class="col-3 col-sm- text-start my-auto" id="userRank-${user._id}">
                            ${user.admin ? 'Admin' : 'Member'}
                        </div>
                        <div class="col-3 col-sm- text-end my-auto">
                            <form class="d-inline" action="/user/<%= user._id %>/manage/<%= currentPlant._id %>?_method=DELETE" method="post">
                                <button class="btn btn-danger">Remove Access</button>
                            </form>
                        </div>
                    </div>`
                } else {
                    li.innerHTML = `
                    <div class="row">
                        <div class="col-3 col-sm- my-auto" id="userName-${user._id}">
                            ${user.firstName} ${user.lastName}
                        </div>
                        <div class="col-3 col-sm- my-auto" id="userEmail-${user._id}">
                            ${user.email}
                        </div>
                        <div class="col-3 col-sm- text-start my-auto" id="userRank-${user._id}">
                            ${user.admin ? 'Admin' : 'Member'}
                        </div>
                        <div class="col-3 col-sm- text-end my-auto">
                            <form class="d-inline" action="/user/${user._id}/manage/${currentPlantID}?_method=PUT" method="post">
                                <button class="btn btn-success">Approve</button>
                            </form>
                        </div>
                    </div>`
                }
            resultBox.appendChild(li);
        }
    }
})