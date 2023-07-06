#pragma once

#include <react/renderer/graphics/Float.h>
#include <react/renderer/graphics/Geometry.h>
#include <react/renderer/graphics/conversions.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook
{
  namespace react
  {

    class JSI_EXPORT RNCAndroidDropdownPickerState final
    {
    public:
      using Shared = std::shared_ptr<const RNCAndroidDropdownPickerState>;

      RNCAndroidDropdownPickerState() : measuredHeight(0){};
      RNCAndroidDropdownPickerState(float measuredHeight_) : measuredHeight(measuredHeight_){};

#ifdef ANDROID
      RNCAndroidDropdownPickerState(
          RNCAndroidDropdownPickerState const &previousState,
          folly::dynamic data) : measuredHeight((Float)data["measuredHeight"].getDouble()){};
#endif

      const float measuredHeight;

#ifdef ANDROID
      folly::dynamic getDynamic() const;
      MapBuffer getMapBuffer() const
      {
        return MapBufferBuilder::EMPTY();
      };

#endif

#pragma mark - Getters
    };

  } // namespace react
} // namespace facebook
