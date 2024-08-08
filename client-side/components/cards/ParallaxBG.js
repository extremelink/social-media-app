
const ParallaxBG = ({url,children="MERNCAMP"}) =>{
    return (
        <div className="container-fluid"
            style={{
                backgroundImage:"url( "+"/images/register.jpg" +" )",
                backgroundAttachment: "fixed",
                padding: "100px 0px 75px 0px",
                width:"100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition:"center center",
                backgroundSize:"cover",
                display:"block"

            }}
        >
            <h1 className="display-1 text-center py-5">{children}</h1>
                    {/* {JSON.stringify(state)} */}
        </div>
    )
}
export default ParallaxBG;