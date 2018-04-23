package com.mmu_social;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
//import com.reactnativenavigation.NavigationReactPackage;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;

import java.util.Arrays;
import java.util.List;
import com.oblador.vectoricons.VectorIconsPackage;

public class MainApplication extends NavigationApplication {
@Override
     public boolean isDebug() {
         // Make sure you are using BuildConfig from your own application
         return BuildConfig.DEBUG;
     }

     protected List<ReactPackage> getPackages() {
         // Add additional packages you require here
         // No need to add RnnPackage and MainReactPackage
         return Arrays.<ReactPackage>asList(
             new VectorIconsPackage(),
             new ImagePickerPackage(),
             new RNFirebasePackage(),
             new RNFirebaseAuthPackage(),
             new RNFirebaseDatabasePackage(),
             new RNFirebaseStoragePackage(),
             new SnackbarPackage(),
             new RNFetchBlobPackage()
         );
     }

     @Override
     public List<ReactPackage> createAdditionalReactPackages() {
         return getPackages();
     }
}
