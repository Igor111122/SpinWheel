import {ButtonGroup,Button, FullscreenBar, InlineStack, TextField,  Layout, LegacyCard} from "@shopify/polaris";
import {Fullscreen, Redirect} from '@shopify/app-bridge/actions';
import {useCallback, useEffect, useState } from "react";
import {useAppBridge} from '@shopify/app-bridge-react';
import settingsStyles from "./styles/settings.css";

export const links = () => [{ rel: "stylesheet", href: settingsStyles }];

export default function AdditionalPage() {

  const app = useAppBridge();

  const redirect = Redirect.create(app);
  const [valueTextLetter, setValueTextLetter] = useState('');

  const ChangeTextLetter = useCallback(
    (newText) => setValueTextLetter(newText),
    [],
  );

  const [valueSubjectLetter, setValueSubjectLetter] = useState('');

  const ChangeSubjectLetter = useCallback(
    (newValue) => setValueSubjectLetter(newValue),
    [],
  );

  useEffect(()=>{
    if(app){
      const fullscreen = Fullscreen.create(app);
      fullscreen.dispatch(Fullscreen.Action.ENTER);
      return()=>{
        fullscreen.dispatch(Fullscreen.Action.EXIT);
      };
    }
  }, [app])
  

  const handleActionClick = useCallback(() => {
    redirect.dispatch(Redirect.Action.APP, '/app');
  }, [redirect]);

  const fullscreenBarMarkup = (
  <FullscreenBar onAction={handleActionClick}>
    <div className="blockFullscreen">
      <ButtonGroup>
        <Button variant="primary" onClick={() => {}}>Save</Button>
      </ButtonGroup>
    </div>
  </FullscreenBar>);


  return (
    <div style={{ height: '100vh' }}>
    {fullscreenBarMarkup}
      <ui-title-bar title="Additional page" />
        <InlineStack wrap={false}>
          <div className="navigateBlock">
            <button onClick={()=>{redirect.dispatch(Redirect.Action.APP, '/app/settings/wheel')}} className="navigateButtons" style={{backgroundImage: `url(https://cdn.shopify.com/s/files/1/0846/8047/4946/files/ThemeEditMajor.svg?v=1702468277)`}}>
            </button>

            <button className="navigateButtons" style={{ backgroundColor: 'rgb(220 220 220)', backgroundImage: `url(https://cdn.shopify.com/s/files/1/0846/8047/4946/files/EmailMajor.svg?v=1702467497)`}}>
            </button>

            <button onClick={()=>{redirect.dispatch(Redirect.Action.APP, '/app/settings/coupon')}} className="navigateButtons" style={{backgroundImage: `url(https://cdn.shopify.com/s/files/1/0846/8047/4946/files/DiscountsMajor.svg?v=1702467539)`}}>
            </button>
          </div>
          <div className="prevAndSettingsBlock" style={{width:'20%'}}>
            <Layout>
              <Layout.Section>
                <LegacyCard title="Change text message of email letter" sectioned>
                  <TextField
                    label="Text of email subject"
                    value={valueSubjectLetter}
                    onChange={ChangeSubjectLetter}
                    autoComplete="off"
                  />
                  <TextField
                    label="Text of email letter (in the end app automatically add coupon)"
                    value={valueTextLetter}
                    onChange={ChangeTextLetter}
                    multiline={3}
                    autoComplete="off"
                  />
                </LegacyCard>
              </Layout.Section>
            </Layout>
          </div>
          
          <div className="prevAndSettingsBlock" style={{width:'78%'}}>123</div>
        </InlineStack>
    </div>
  );
}
