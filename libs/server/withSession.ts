import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
    interface IronSessionData {
      user?: {
        id: number;
      };
    }
  }

const cookieOpitons =  {
    cookieName: "carrotsession",
    password: "wfqwylkcdtyjqwf986w98w698fq6w9f86765q67w47sdf34212",
  }

  export function withApiSession(fn:any){
    return withIronSessionApiRoute(fn, cookieOpitons)
  }