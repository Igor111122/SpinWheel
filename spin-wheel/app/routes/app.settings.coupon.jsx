import {ButtonGroup,Button, FullscreenBar, InlineStack, Layout, LegacyCard, TextField} from "@shopify/polaris";
import {Fullscreen, Redirect} from '@shopify/app-bridge/actions';
import {useCallback, useEffect, useState } from "react";
import {useAppBridge} from '@shopify/app-bridge-react';
import settingsStyles from "./styles/settings.css";

export const links = () => [{ rel: "stylesheet", href: settingsStyles }];

export default function AdditionalPage() {

  const app = useAppBridge();
  const [value1Coupon, setValue1Coupon] = useState('');

  const Change1Coupon = useCallback(
    (newText) => setValue1Coupon(newText),
    [],
  );

  const [value2Coupon, setValue2Coupon] = useState('');

  const Change2Coupon = useCallback(
    (newText) => setValue2Coupon(newText),
    [],
  );

  const [value3Coupon, setValue3Coupon] = useState('');

  const Change3Coupon = useCallback(
    (newText) => setValue3Coupon(newText),
    [],
  );

  const [value4Coupon, setValue4Coupon] = useState('');

  const Change4Coupon = useCallback(
    (newText) => setValue4Coupon(newText),
    [],
  );

  const [value5Coupon, setValue5Coupon] = useState('');

  const Change5Coupon = useCallback(
    (newText) => setValue5Coupon(newText),
    [],
  );

  const [value6Coupon, setValue6Coupon] = useState('');

  const Change6Coupon = useCallback(
    (newText) => setValue6Coupon(newText),
    [],
  );

  const [value7Coupon, setValue7Coupon] = useState('');

  const Change7Coupon = useCallback(
    (newText) => setValue7Coupon(newText),
    [],
  );


  const redirect = Redirect.create(app);
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

            <button onClick={()=>{redirect.dispatch(Redirect.Action.APP, '/app/settings/email')}} className="navigateButtons" style={{backgroundImage: `url(https://cdn.shopify.com/s/files/1/0846/8047/4946/files/EmailMajor.svg?v=1702467497)`}}>
            </button>

            <button className="navigateButtons" style={{backgroundColor: 'rgb(220 220 220)', backgroundImage: `url(https://cdn.shopify.com/s/files/1/0846/8047/4946/files/DiscountsMajor.svg?v=1702467539)`}}>
            </button>
          </div>
          <div className="prevAndSettingsBlock" style={{width:'20%'}}>
            <Layout>
              <Layout.Section>
                <LegacyCard title="Enter coupons" sectioned>
                  <TextField
                    label="First coupon"
                    value={value1Coupon}
                    onChange={Change1Coupon}
                    autoComplete="off"
                  />
                  <TextField
                    label="Second coupon"
                    value={value2Coupon}
                    onChange={Change2Coupon}
                    autoComplete="off"
                  />
                  <TextField
                    label="Third coupon"
                    value={value3Coupon}
                    onChange={Change3Coupon}
                    autoComplete="off"
                  />
                  <TextField
                    label="Fourth coupon"
                    value={value4Coupon}
                    onChange={Change4Coupon}
                    autoComplete="off"
                  />
                  <TextField
                    label="Fifth coupon"
                    value={value5Coupon}
                    onChange={Change5Coupon}
                    autoComplete="off"
                  />
                  <TextField
                    label="Sixth coupon"
                    value={value6Coupon}
                    onChange={Change6Coupon}
                    autoComplete="off"
                  />
                  <TextField
                    label="Seventh coupon"
                    value={value7Coupon}
                    onChange={Change7Coupon}
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
