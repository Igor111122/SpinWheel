import {ButtonGroup,Button, FullscreenBar, InlineStack, Layout} from "@shopify/polaris";
import {Fullscreen, Redirect} from '@shopify/app-bridge/actions';
import {useCallback, useEffect, useState} from "react";
import {useAppBridge} from '@shopify/app-bridge-react';
import settingsStyles from "./styles/settings.css";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import {useLoaderData, useSubmit} from "@remix-run/react";
import {findValueByNamespaceAndKey, HSBToRGB, ColorAndTextComponent} from "./helpers/wheelHelpers";

export const links = () => [{ rel: "stylesheet", href: settingsStyles }];

//-------------------------------------------------------------------------------------------------------------------------------------------------------

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const responseId = await admin.graphql(
    `query {
      currentAppInstallation {
        id
      }
    }`,
  );
  const responseIdJson = await responseId.json();

  const response = await admin.graphql(
    `query AppInstallationMetafields($ownerId: ID!) {
      appInstallation(id: $ownerId) {
        metafields(first: 250) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }`,
    {
      variables: {
        ownerId: responseIdJson.data.currentAppInstallation.id,
      },
    }
  );

  const data = await response.json();

  return json({
    settingsData: data.data.appInstallation.metafields.edges,
    allData: data
  });
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const responseId = await admin.graphql(
    `query {
      currentAppInstallation {
        id
      }
    }`,
  );
  const responseIdJson = await responseId.json();

  const body = await request.formData();//get data from request

  let arrOfColors = body.get("arrOfColors");
  let arrOfTexts = body.get("arrOfTexts").split(',');
  arrOfColors = JSON.parse(arrOfColors);
  let resultArray = [];
 
  // Создаем объекты для цветов
  arrOfColors.forEach(function(color, index) {
    resultArray.push({
      namespace: "Settings",
      key: "color" + (index + 1) + "SectorOfWheel",
      type: "single_line_text_field",
      value: color,
      ownerId: responseIdJson.data.currentAppInstallation.id
    });
  });
 
  // Создаем объекты для текстов
  arrOfTexts.forEach(function(text, index) {
    resultArray.push({
      namespace: "Settings",
      key: "text" + (index + 1) + "SectorOfWheel",
      type: "single_line_text_field",
      value: text,
      ownerId: responseIdJson.data.currentAppInstallation.id
    });
  });

  const responseSetMeta = await admin.graphql(
    `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafieldsSetInput) {
      metafields {
        id
        namespace
        key 
      }
      userErrors {
        field
        message
      }
    }
  }`
      ,
      {
        variables: {
          metafieldsSetInput: resultArray,
        },
      });
  const responseSetMetaJson = await responseSetMeta.json();

  return json({meta: responseSetMetaJson});
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------

export default function AdditionalPage() {

  const loaderData = useLoaderData();
  const [textsFieldValue, setTextFieldValue] = useState(Array.from({ length: 8 }, () => '123'));
  const app = useAppBridge();
  const submit = useSubmit();
  const [colors, setColors] = useState(Array.from({ length: 8 }, () => ({
    hue: 120,
    brightness: 1,
    saturation: 1,
  })));

  const handleTextFieldChange = (event, index) => {
    // Копируем текущий массив состояний
    const newChildStates = [...textsFieldValue];
    // Изменяем состояние только для конкретного дочернего компонента
    newChildStates[index] = event;
    // Обновляем состояние
    setTextFieldValue(newChildStates);
  };


  const setColorSector = (event, index) => {
    // Копируем текущий массив состояний
    const newChildStates = [...colors];
    // Изменяем состояние только для конкретного дочернего компонента
    newChildStates[index] = event;
    // Обновляем состояние
    setColors(newChildStates);
  };


  const redirect = Redirect.create(app);
  useEffect(() => {
    if(app){
      const fullscreen = Fullscreen.create(app);
      fullscreen.dispatch(Fullscreen.Action.ENTER);
      return() => {
        fullscreen.dispatch(Fullscreen.Action.EXIT);
      };
    }
  }, [app])

  const goToMainPage = useCallback(() => {
    redirect.dispatch(Redirect.Action.APP, '/app');
  }, [redirect]);

  const saveSettings = useCallback((arrOfColorsHBS, arrOfTexts) => {
    
    const arrayOfColorsRGB = arrOfColorsHBS.map(obj => HSBToRGB(obj.hue,obj.saturation,obj.brightness));

    submit({arrOfColors: JSON.stringify(arrayOfColorsRGB) , arrOfTexts: arrOfTexts}, { replace: true, method: "POST" });
  }, [arrayOfColorsRGB]);

  const fullscreenBarMarkup = (
  <FullscreenBar onAction={goToMainPage}>
    <div className="blockFullscreen">
      <ButtonGroup>
        <Button variant="primary" onClick={() => {saveSettings(colors, textsFieldValue)}}>Save</Button>
      </ButtonGroup>
    </div>
  </FullscreenBar>);

  // Creating 8 child components in loop
  const ColorAndTextComponents = textsFieldValue.map((state, index) => (
    <ColorAndTextComponent key={index} index={index+1} color={colors[index]} setColor={(event) => setColorSector(event, index)} textFieldValue={textsFieldValue[index]} setText={(event2) => handleTextFieldChange(event2, index)}/>
  ));

  return (
    <div style={{ height: '100vh'}}>
    {fullscreenBarMarkup}
      <ui-title-bar title="Additional page" />
        <InlineStack wrap={true}>

          <div className="navigateBlock">
            <button className="navigateButtons" style={{backgroundColor: 'rgb(220 220 220)', backgroundImage: `url(https://cdn.shopify.com/s/files/1/0846/8047/4946/files/ThemeEditMajor.svg?v=1702468277)`}}>
            </button>

            <button onClick={()=>{redirect.dispatch(Redirect.Action.APP, '/app/settings/email')}} className="navigateButtons" style={{backgroundImage: `url(https://cdn.shopify.com/s/files/1/0846/8047/4946/files/EmailMajor.svg?v=1702467497)`}}>
            </button>

            <button onClick={()=>{redirect.dispatch(Redirect.Action.APP, '/app/settings/coupon')}} className="navigateButtons" style={{backgroundImage: `url(https://cdn.shopify.com/s/files/1/0846/8047/4946/files/DiscountsMajor.svg?v=1702467539)`}}>
            </button>
          </div>

          <div className="prevAndSettingsBlock" style={{width:'20%'}}>
            <Layout>
              {ColorAndTextComponents}
            </Layout>
          </div>

          <div className="prevAndSettingsBlock" style={{width:'78%', display:"flex", alignItems:'center', justifyContent:'center'}}>
          <div style={{position:'relative'}}>
            <div className="imageArrowDiv">
              <img src="https://cdn.shopify.com/s/files/1/0846/8047/4946/files/arrow_down.png?v=1701714348" class="imageArrow" alt="imageArrow"/>
            </div>
            <div className="container" id="container">
              <div style={{backgroundColor: `${findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "color1sectorofwheel")}`}} class="one">{findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "text1SectorOfWheel")}</div>
              <div style={{backgroundColor: `${findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "color2SectorOfWheel")}`}} className="two">{findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "text2SectorOfWheel")}</div>
              <div style={{backgroundColor: `${findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "color3SectorOfWheel")}`}} className="three">{findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "text3SectorOfWheel")}</div>
              <div style={{backgroundColor: `${findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "color4SectorOfWheel")}`}} className="four">{findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "text4SectorOfWheel")}</div>
              <div style={{backgroundColor: `${findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "color5SectorOfWheel")}`}} className="five">{findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "text5SectorOfWheel")}</div>
              <div style={{backgroundColor: `${findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "color6SectorOfWheel")}`}} className="six">{findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "text6SectorOfWheel")}</div>
              <div style={{backgroundColor: `${findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "color7SectorOfWheel")}`}} className="seven">{findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "text7SectorOfWheel")}</div>
              <div style={{backgroundColor: `${findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "color8SectorOfWheel")}`}} className="eight">{findValueByNamespaceAndKey(loaderData.settingsData, "Settings", "text8SectorOfWheel")}</div>
            </div>
          </div>

          </div>
        </InlineStack>
    </div>
  );
}