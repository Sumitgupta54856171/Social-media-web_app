import { gql } from '@apollo/client';
 export const Get_user= gql`
 query getuser($id: ID){
 user(id:$id){
 id
 name
 email
 }
 }
 `;
 export const Create_user=gql`
 mutation Creatauser($name:String!,$email:String){
 creatuser(name:$name,email:$email){
 id
 name
 email
 }
 }
 `