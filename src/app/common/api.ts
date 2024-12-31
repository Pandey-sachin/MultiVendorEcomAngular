
const domain = "http://localhost:5000"
const api={
    SignUp : {
        url : `${domain}/users/signup`,
        method: "POST"
    },
    SignIn :{
         url : `${domain}/auth/login`,
        method: "post"
    },
    SignOut:{
        url : `${domain}/auth/signout`,
        method: "post"
    },
    GetAllProducts:{
        url : `${domain}/products`,
        method: "GET"
    },
    GetProductByVendor :{
        url :  `${domain}/products`,
        method: "GET"
    },
    AddProduct :{
        url : `${domain}/products`,
        method : "POST"
    },
    UpdateProduct :{
        url : `${domain}/products`,
        method : "PUT"
    },
    DeleteProduct :{
        url : `${domain}/products`,
        method : "Delete"
    },
    DeleteALLProduct :{
        url : `${domain}/products/delete`,
        method : "POST"
    }

}
export default api;