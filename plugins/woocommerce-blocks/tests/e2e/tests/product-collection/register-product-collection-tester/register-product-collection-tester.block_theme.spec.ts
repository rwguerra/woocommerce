/**
 * External dependencies
 */
import { test as base, expect } from '@woocommerce/e2e-utils';

/**
 * Internal dependencies
 */
import ProductCollectionPage, {
	BLOCK_LABELS,
	Collections,
	SELECTORS,
} from '../product-collection.page';

const test = base.extend< { pageObject: ProductCollectionPage } >( {
	pageObject: async ( { page, admin, editor }, use ) => {
		const pageObject = new ProductCollectionPage( {
			page,
			admin,
			editor,
		} );
		await use( pageObject );
	},
} );

/**
 * These E2E tests are for `registerProductCollection` which we are exposing
 * for 3PDs to register new product collections.
 */
test.describe( 'Testing registerProductCollection', () => {
	const MY_REGISTERED_COLLECTIONS = {
		myCustomCollection: {
			name: 'My Custom Collection',
			label: 'Block: My Custom Collection',
		},
		myCustomCollectionWithPreview: {
			name: 'My Custom Collection with Preview',
			label: 'Block: My Custom Collection with Preview',
		},
		myCustomCollectionWithAdvancedPreview: {
			name: 'My Custom Collection with Advanced Preview',
			label: 'Block: My Custom Collection with Advanced Preview',
		},
	};

	// Activate plugin which registers custom product collections
	test.beforeEach( async ( { requestUtils } ) => {
		await requestUtils.activatePlugin(
			'register-product-collection-tester'
		);
	} );

	test( `Registered collections should be available in Collection chooser`, async ( {
		pageObject,
		editor,
		admin,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlockUsingGlobalInserter( pageObject.BLOCK_NAME );
		await editor.canvas
			.getByRole( 'button', {
				name: 'Choose collection',
			} )
			.click();

		// Get text of all buttons in the collection chooser
		const collectionChooserButtonsTexts = await editor.canvas
			.locator( '.wc-blocks-product-collection__collection-button-title' )
			.allTextContents();

		// Check if all registered collections are available in the collection chooser
		expect(
			collectionChooserButtonsTexts.includes(
				MY_REGISTERED_COLLECTIONS.myCustomCollection.name
			)
		).toBeTruthy();
		expect(
			collectionChooserButtonsTexts.includes(
				MY_REGISTERED_COLLECTIONS.myCustomCollectionWithPreview.name
			)
		).toBeTruthy();
		expect(
			collectionChooserButtonsTexts.includes(
				MY_REGISTERED_COLLECTIONS.myCustomCollectionWithAdvancedPreview
					.name
			)
		).toBeTruthy();
	} );

	test.describe( 'My Custom Collection', () => {
		test( 'Clicking "My Custom Collection" should insert block and show 5 products', async ( {
			pageObject,
		} ) => {
			await pageObject.createNewPostAndInsertBlock(
				'myCustomCollection'
			);

			await expect( pageObject.products ).toHaveCount( 5 );
			await expect( pageObject.productImages ).toHaveCount( 5 );
			await expect( pageObject.productTitles ).toHaveCount( 5 );
			await expect( pageObject.productPrices ).toHaveCount( 5 );
			await expect( pageObject.addToCartButtons ).toHaveCount( 5 );

			await pageObject.publishAndGoToFrontend();
			await expect( pageObject.products ).toHaveCount( 5 );
		} );

		test( 'Should display properly in Product Catalog template', async ( {
			pageObject,
			editor,
		} ) => {
			await pageObject.goToProductCatalogAndInsertCollection(
				'myCustomCollection'
			);

			const block = editor.canvas.getByLabel(
				MY_REGISTERED_COLLECTIONS.myCustomCollection.label
			);

			const products = block
				.getByLabel( BLOCK_LABELS.productImage )
				.locator( 'visible=true' );
			await expect( products ).toHaveCount( 5 );
		} );

		test( 'hideControls allows to hide filters', async ( {
			pageObject,
			page,
		} ) => {
			await pageObject.goToProductCatalogAndInsertCollection(
				'myCustomCollection'
			);

			const sidebarSettings = pageObject.locateSidebarSettings();
			const onsaleControl = sidebarSettings.getByLabel(
				SELECTORS.onSaleControlLabel
			);
			await expect( onsaleControl ).toBeHidden();

			await page
				.getByRole( 'button', { name: 'Filters options' } )
				.click();
			const keywordControl = page.getByRole( 'menuitemcheckbox', {
				name: 'Keyword',
			} );

			await expect( keywordControl ).toBeHidden();
		} );
	} );

	test.describe( 'My Custom Collection with Preview', () => {
		test( 'Clicking "My Custom Collection with Preview" should insert block and show 9 products', async ( {
			pageObject,
		} ) => {
			await pageObject.createNewPostAndInsertBlock(
				'myCustomCollectionWithPreview'
			);

			await expect( pageObject.products ).toHaveCount( 9 );
			await expect( pageObject.productImages ).toHaveCount( 9 );
			await expect( pageObject.productTitles ).toHaveCount( 9 );
			await expect( pageObject.productPrices ).toHaveCount( 9 );
			await expect( pageObject.addToCartButtons ).toHaveCount( 9 );

			await pageObject.publishAndGoToFrontend();
			await expect( pageObject.products ).toHaveCount( 9 );
		} );

		test( 'Clicking "My Custom Collection with Preview" should show preview', async ( {
			pageObject,
			editor,
		} ) => {
			await pageObject.createNewPostAndInsertBlock(
				'myCustomCollectionWithPreview'
			);
			const previewButtonLocator = editor.canvas.getByTestId(
				SELECTORS.previewButtonTestID
			);

			// The preview button should be visible
			await expect( previewButtonLocator ).toBeVisible();
		} );

		test( 'Should display properly in Product Catalog template', async ( {
			pageObject,
			editor,
		} ) => {
			await pageObject.goToProductCatalogAndInsertCollection(
				'myCustomCollectionWithPreview'
			);

			const block = editor.canvas.getByLabel(
				MY_REGISTERED_COLLECTIONS.myCustomCollectionWithPreview.label
			);

			// Check if products are visible
			const products = block
				.getByLabel( BLOCK_LABELS.productImage )
				.locator( 'visible=true' );
			await expect( products ).toHaveCount( 9 );

			// Check if the preview button is visible
			const previewButtonLocator = block.getByTestId(
				SELECTORS.previewButtonTestID
			);
			await expect( previewButtonLocator ).toBeVisible();
		} );
	} );

	test.describe( 'My Custom Collection with Advanced Preview', () => {
		test( 'Clicking "My Custom Collection with Advanced Preview" should insert block and show 9 products', async ( {
			pageObject,
		} ) => {
			await pageObject.createNewPostAndInsertBlock(
				'myCustomCollectionWithAdvancedPreview'
			);

			await expect( pageObject.products ).toHaveCount( 9 );
			await expect( pageObject.productImages ).toHaveCount( 9 );
			await expect( pageObject.productTitles ).toHaveCount( 9 );
			await expect( pageObject.productPrices ).toHaveCount( 9 );
			await expect( pageObject.addToCartButtons ).toHaveCount( 9 );

			await pageObject.publishAndGoToFrontend();
			await expect( pageObject.products ).toHaveCount( 9 );
		} );

		test( 'Clicking "My Custom Collection with Advanced Preview" should show preview for 1 second', async ( {
			pageObject,
			editor,
			page,
		} ) => {
			await pageObject.createNewPostAndInsertBlock(
				'myCustomCollectionWithAdvancedPreview'
			);
			const previewButtonLocator = editor.canvas.getByTestId(
				SELECTORS.previewButtonTestID
			);

			// The preview button should be visible
			await expect( previewButtonLocator ).toBeVisible();

			// Disabling eslint rule because we need to wait for the preview to disappear
			// eslint-disable-next-line playwright/no-wait-for-timeout, no-restricted-syntax
			await page.waitForTimeout( 1000 );

			// The preview button should be hidden
			await expect( previewButtonLocator ).toBeHidden();
		} );

		test( 'Should display properly in Product Catalog template', async ( {
			pageObject,
			editor,
			page,
		} ) => {
			await pageObject.goToProductCatalogAndInsertCollection(
				'myCustomCollectionWithAdvancedPreview'
			);

			const block = editor.canvas.getByLabel(
				MY_REGISTERED_COLLECTIONS.myCustomCollectionWithAdvancedPreview
					.label
			);

			// Check if the preview button is visible
			const previewButtonLocator = block.getByTestId(
				SELECTORS.previewButtonTestID
			);
			await expect( previewButtonLocator ).toBeVisible();

			// Check if products are visible
			const products = block
				.getByLabel( BLOCK_LABELS.productImage )
				.locator( 'visible=true' );
			await expect( products ).toHaveCount( 9 );

			// Disabling eslint rule because we need to wait for the preview to disappear
			// eslint-disable-next-line playwright/no-wait-for-timeout, no-restricted-syntax
			await page.waitForTimeout( 1000 );

			// The preview button should be hidden after 1 second
			await expect( previewButtonLocator ).toBeHidden();
		} );
	} );
} );

test.describe( 'Testing "usesReference" argument in "registerProductCollection"', () => {
	const MY_REGISTERED_COLLECTIONS = {
		myCustomCollectionWithProductContext: {
			name: 'My Custom Collection - Product Context',
			label: 'Block: My Custom Collection - Product Context',
			previewLabelTemplate: [ 'woocommerce/woocommerce//single-product' ],
		},
		myCustomCollectionWithCartContext: {
			name: 'My Custom Collection - Cart Context',
			label: 'Block: My Custom Collection - Cart Context',
			previewLabelTemplate: [ 'woocommerce/woocommerce//page-cart' ],
		},
		myCustomCollectionWithOrderContext: {
			name: 'My Custom Collection - Order Context',
			label: 'Block: My Custom Collection - Order Context',
			previewLabelTemplate: [
				'woocommerce/woocommerce//order-confirmation',
			],
		},
		myCustomCollectionWithArchiveContext: {
			name: 'My Custom Collection - Archive Context',
			label: 'Block: My Custom Collection - Archive Context',
			previewLabelTemplate: [
				'woocommerce/woocommerce//taxonomy-product_cat',
			],
		},
		myCustomCollectionMultipleContexts: {
			name: 'My Custom Collection - Multiple Contexts',
			label: 'Block: My Custom Collection - Multiple Contexts',
			previewLabelTemplate: [
				'woocommerce/woocommerce//single-product',
				'woocommerce/woocommerce//order-confirmation',
			],
		},
	};

	// Activate plugin which registers custom product collections
	test.beforeEach( async ( { requestUtils } ) => {
		await requestUtils.activatePlugin(
			'register-product-collection-tester'
		);
	} );

	Object.entries( MY_REGISTERED_COLLECTIONS ).forEach(
		( [ key, collection ] ) => {
			for ( const template of collection.previewLabelTemplate ) {
				test( `Collection "${ collection.name }" should show preview label in "${ template }"`, async ( {
					pageObject,
					editor,
				} ) => {
					await pageObject.goToEditorTemplate( template );
					await pageObject.insertProductCollection();
					await pageObject.chooseCollectionInTemplate(
						key as Collections
					);

					const block = editor.canvas.getByLabel( collection.label );
					const previewButtonLocator = block.getByTestId(
						SELECTORS.previewButtonTestID
					);

					await expect( previewButtonLocator ).toBeVisible();
				} );
			}

			test( `Collection "${ collection.name }" should not show preview label in a post`, async ( {
				pageObject,
				editor,
			} ) => {
				await pageObject.createNewPostAndInsertBlock(
					key as Collections
				);

				const block = editor.canvas.getByLabel( collection.label );
				const previewButtonLocator = block.getByTestId(
					SELECTORS.previewButtonTestID
				);

				await expect( previewButtonLocator ).toBeHidden();
			} );

			test( `Collection "${ collection.name }" should not show preview label in Product Catalog template`, async ( {
				pageObject,
				editor,
			} ) => {
				await pageObject.goToProductCatalogAndInsertCollection(
					key as Collections
				);

				const block = editor.canvas.getByLabel( collection.label );
				const previewButtonLocator = block.getByTestId(
					SELECTORS.previewButtonTestID
				);

				await expect( previewButtonLocator ).toBeHidden();
			} );
		}
	);
} );
