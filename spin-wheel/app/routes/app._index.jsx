import { json } from "@remix-run/node";
import {useLoaderData, useSubmit } from "@remix-run/react";
import {Page, Layout, Text, Card, Button, BlockStack, InlineStack, } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {Redirect} from '@shopify/app-bridge/actions';
import {useAppBridge} from '@shopify/app-bridge-react';

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const responseID = await admin.rest.get({path: `themes`});//return all themes (need to find theme id)

  const responseIDJson = await responseID.json();

  const response = await admin.rest.get({path: `themes/${responseIDJson.themes[0].id}/assets.json?asset[key]=config/settings_data.json`});//return settings_data.json

  const responseJson = await response.json();
  
  const selectedJson = JSON.parse(responseJson.asset.value).current.blocks

  const appNameToFind = "spin-wheel";

  let disabled = null;
  
  // Need to output field disabled
  for (const key in selectedJson) {
    if (selectedJson.hasOwnProperty(key)) {
      const item = selectedJson[key];

      if (item.type && item.type.includes(appNameToFind)) {
        disabled = item.disabled;
      }
    }
  }

  if(disabled == true ){
    return json({
      selectedJson: selectedJson, 
      themeId: responseIDJson.themes[0].id,
    });
  }

  return json({
    themeId: responseIDJson.themes[0].id
  });
};

export default function Index() {
  
  //const actionData = useActionData();
  const loaderData = useLoaderData();
  const submit = useSubmit();

  const generateProduct = () => submit({}, { replace: true, method: "POST" });

  const app = useAppBridge();
  const redirect = Redirect.create(app);

  return (
    <Page>
      <ui-title-bar title="Remix app template">
        <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button>
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Congrats you are on mane page 🎉
                  </Text>
                </BlockStack>
                <InlineStack gap="300">
                  <Button onClick={()=>{redirect.dispatch(Redirect.Action.APP, '/app/settings/wheel')}}>Go to customize page</Button>
                </InlineStack>
                {loaderData?.selectedJson && (
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">Please activate our app</Text>
                    <Button onClick={()=>{redirect.dispatch(Redirect.Action.ADMIN_PATH, `/themes/${loaderData.themeId}/editor?context=apps`)}}>Activate our app</Button>
                </BlockStack>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
