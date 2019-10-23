require 'test_helper'

class PermissionsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get permissions_create_url
    assert_response :success
  end

  test "should get destroy" do
    get permissions_destroy_url
    assert_response :success
  end

end
