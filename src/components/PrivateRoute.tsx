import {useEffect, PropsWithChildren} from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function PrivateRoute ({children}: PropsWithChildren){
    const {currentUser} = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        if(currentUser === null){
            navigate("/sign-up", {replace:true});
        }
    },[navigate, currentUser]);
}