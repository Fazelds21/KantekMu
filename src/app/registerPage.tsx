import {View, useWindowDimensions} from "react-native"
import HeroPanel from "@/components/HeroPanel"
import { styles } from "@/styles/loginStyles";

export default function registerPage(){
    const { width } = useWindowDimensions();
    const isWide = width >= 850;
    <View>
        {isWide && <HeroPanel/>}
    </View>
}