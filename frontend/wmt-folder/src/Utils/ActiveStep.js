import SelectPrimitive from "../components/LandingPage/Steps/PrimitiveStep/SelectPrimitive";
import FinalStep from "../components/LandingPage/Steps/FinalStep/FinalStep";
import UploadProject2 from "../components/LandingPage/Steps/UploadStep/test/UploadProject2";

export default function ActiveStep(props) {
    var willRender;

    switch (props.activeStep){
        default:
        case 0:
            willRender = <SelectPrimitive />;
          break;
        case 1:
            willRender = <UploadProject2 />;
          break;
        case 2:
            willRender = <FinalStep />;
          break;
    }

    return willRender;
}